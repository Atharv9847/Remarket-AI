from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime

from app.database import get_db
from app.models.offer import Offer
from app.models.product import Product
from app.models.user import User
from app.schemas.offer import OfferCreate, OfferCounter, OfferResponse
from app.auth.dependencies import get_current_user
from app.websocket.manager import manager

router = APIRouter(prefix="/offers", tags=["Offers & Bargains"])

def format_offer(o: Offer) -> dict:
    first_img = o.product.images[0].image_url if o.product and o.product.images else None
    return {
        "id": o.id,
        "product_id": o.product_id,
        "buyer_id": o.buyer_id,
        "seller_id": o.seller_id,
        "amount": o.amount,
        "counter_amount": o.counter_amount,
        "note": o.note,
        "status": o.status,
        "created_at": o.created_at,
        "updated_at": o.updated_at,
        "buyer": o.buyer,
        "seller": o.seller,
        "product_title": o.product.title if o.product else "Item",
        "product_price": o.product.price if o.product else 0.0,
        "product_image": first_img
    }

@router.post("", response_model=OfferResponse)
async def create_offer(
    offer_in: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prod = db.query(Product).filter(Product.id == offer_in.product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
        
    if prod.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot make an offer on your own item")
        
    new_offer = Offer(
        product_id=prod.id,
        buyer_id=current_user.id,
        seller_id=prod.seller_id,
        amount=offer_in.amount,
        note=offer_in.note,
        status="PENDING"
    )
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    
    # Notify seller via websocket
    await manager.send_personal_message({
        "type": "new_offer",
        "offer_id": new_offer.id,
        "amount": new_offer.amount,
        "product_title": prod.title,
        "buyer_name": current_user.name
    }, prod.seller_id)
    
    return format_offer(new_offer)

@router.get("", response_model=List[OfferResponse])
def get_user_offers(
    type: str = "all", # "made", "received", "all"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Offer)
    if type == "made":
        query = query.filter(Offer.buyer_id == current_user.id)
    elif type == "received":
        query = query.filter(Offer.seller_id == current_user.id)
    else:
        query = query.filter((Offer.buyer_id == current_user.id) | (Offer.seller_id == current_user.id))
        
    offers = query.order_by(Offer.created_at.desc()).all()
    return [format_offer(o) for o in offers]

@router.put("/{offer_id}/accept", response_model=OfferResponse)
async def accept_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    if offer.seller_id != current_user.id and offer.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    offer.status = "ACCEPTED"
    offer.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(offer)
    
    other_id = offer.buyer_id if current_user.id == offer.seller_id else offer.seller_id
    await manager.send_personal_message({
        "type": "offer_accepted",
        "offer_id": offer.id,
        "message": f"Your offer of ₹{offer.amount:,.0f} has been ACCEPTED!"
    }, other_id)
    
    return format_offer(offer)

@router.put("/{offer_id}/counter", response_model=OfferResponse)
async def counter_offer(
    offer_id: int,
    counter_in: OfferCounter,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    if offer.seller_id != current_user.id and offer.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    offer.counter_amount = counter_in.counter_amount
    offer.note = counter_in.note or offer.note
    offer.status = "COUNTERED"
    offer.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(offer)
    
    other_id = offer.buyer_id if current_user.id == offer.seller_id else offer.seller_id
    await manager.send_personal_message({
        "type": "offer_countered",
        "offer_id": offer.id,
        "counter_amount": offer.counter_amount
    }, other_id)
    
    return format_offer(offer)

@router.put("/{offer_id}/reject", response_model=OfferResponse)
def reject_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    if offer.seller_id != current_user.id and offer.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    offer.status = "REJECTED"
    offer.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(offer)
    return format_offer(offer)
