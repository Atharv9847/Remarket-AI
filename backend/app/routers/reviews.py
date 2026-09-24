from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.review import Review
from app.models.user import User
from app.models.product import Product
from app.schemas.review import ReviewCreate, ReviewResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews & Reputation"])

@router.post("", response_model=ReviewResponse)
def create_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == review_in.reviewee_id:
        raise HTTPException(status_code=400, detail="Cannot review yourself")
        
    rev = Review(
        reviewer_id=current_user.id,
        reviewee_id=review_in.reviewee_id,
        product_id=review_in.product_id,
        rating=review_in.rating,
        review=review_in.review
    )
    db.add(rev)
    db.commit()
    db.refresh(rev)
    
    prod = db.query(Product).filter(Product.id == review_in.product_id).first()
    return {
        "id": rev.id,
        "reviewer_id": rev.reviewer_id,
        "reviewee_id": rev.reviewee_id,
        "product_id": rev.product_id,
        "rating": rev.rating,
        "review": rev.review,
        "created_at": rev.created_at,
        "reviewer": current_user,
        "product_title": prod.title if prod else None
    }

@router.get("/user/{user_id}", response_model=List[ReviewResponse])
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.reviewee_id == user_id).order_by(Review.created_at.desc()).all()
    results = []
    for r in reviews:
        prod = db.query(Product).filter(Product.id == r.product_id).first()
        results.append({
            "id": r.id,
            "reviewer_id": r.reviewer_id,
            "reviewee_id": r.reviewee_id,
            "product_id": r.product_id,
            "rating": r.rating,
            "review": r.review,
            "created_at": r.created_at,
            "reviewer": r.reviewer,
            "product_title": prod.title if prod else None
        })
    return results
