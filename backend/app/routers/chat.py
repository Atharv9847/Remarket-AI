from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime

from app.database import get_db
from app.models.conversation import Conversation, Message
from app.models.product import Product
from app.models.user import User
from app.schemas.chat import ConversationResponse, MessageResponse, MessageCreate
from app.auth.dependencies import get_current_user
from app.websocket.manager import manager

router = APIRouter(prefix="/chat", tags=["Realtime Chat"])

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    convs = db.query(Conversation).filter(
        (Conversation.buyer_id == current_user.id) | (Conversation.seller_id == current_user.id)
    ).order_by(Conversation.updated_at.desc()).all()
    
    results = []
    for c in convs:
        other_user = c.seller if c.buyer_id == current_user.id else c.buyer
        last_msg = db.query(Message).filter(Message.conversation_id == c.id).order_by(Message.created_at.desc()).first()
        unread_count = db.query(Message).filter(
            Message.conversation_id == c.id,
            Message.receiver_id == current_user.id,
            Message.is_read == False
        ).count()
        
        prod_img = c.product.images[0].image_url if c.product and c.product.images else None
        
        results.append({
            "id": c.id,
            "product_id": c.product_id,
            "buyer_id": c.buyer_id,
            "seller_id": c.seller_id,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "last_message": last_msg,
            "other_user": other_user,
            "product_title": c.product.title if c.product else "Item",
            "product_image": prod_img,
            "product_price": c.product.price if c.product else 0.0,
            "unread_count": unread_count
        })
    return results

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conv.buyer_id != current_user.id and conv.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    # Mark messages as read
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).update({"is_read": True, "read_at": datetime.datetime.utcnow()})
    db.commit()
    
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()
    return messages

@router.post("/messages", response_model=MessageResponse)
async def send_message(
    msg_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = None
    if msg_in.conversation_id:
        conv = db.query(Conversation).filter(Conversation.id == msg_in.conversation_id).first()
        
    if not conv:
        if not msg_in.product_id:
            raise HTTPException(status_code=400, detail="product_id is required to create a new conversation")
            
        prod = db.query(Product).filter(Product.id == msg_in.product_id).first()
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")
            
        # check if existing conversation exists
        conv = db.query(Conversation).filter(
            Conversation.product_id == msg_in.product_id,
            Conversation.buyer_id == current_user.id,
            Conversation.seller_id == msg_in.receiver_id
        ).first()
        
        if not conv:
            conv = Conversation(
                product_id=msg_in.product_id,
                buyer_id=current_user.id,
                seller_id=msg_in.receiver_id
            )
            db.add(conv)
            db.commit()
            db.refresh(conv)

    new_msg = Message(
        conversation_id=conv.id,
        sender_id=current_user.id,
        receiver_id=msg_in.receiver_id,
        product_id=msg_in.product_id or conv.product_id,
        message_type=msg_in.message_type or "text",
        message=msg_in.message,
        payload=msg_in.payload,
        is_read=False
    )
    db.add(new_msg)
    conv.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(new_msg)
    
    # Broadcast to receiver
    await manager.send_personal_message({
        "type": "new_chat_message",
        "conversation_id": conv.id,
        "message_id": new_msg.id,
        "sender_id": current_user.id,
        "sender_name": current_user.name,
        "message": new_msg.message,
        "created_at": new_msg.created_at.isoformat()
    }, msg_in.receiver_id)
    
    return new_msg
