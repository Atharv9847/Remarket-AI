from pydantic import BaseModel
from typing import Optional
import datetime
from app.schemas.user import UserResponse

class ReviewCreate(BaseModel):
    product_id: int
    reviewee_id: int
    rating: float
    review: str

class ReviewResponse(BaseModel):
    id: int
    reviewer_id: int
    reviewee_id: int
    product_id: int
    rating: float
    review: str
    created_at: datetime.datetime
    reviewer: Optional[UserResponse] = None
    product_title: Optional[str] = None

    class Config:
        from_attributes = True
