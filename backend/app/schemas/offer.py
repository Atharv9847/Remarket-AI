from pydantic import BaseModel
from typing import Optional
import datetime
from app.schemas.user import UserResponse

class OfferCreate(BaseModel):
    product_id: int
    amount: float
    note: Optional[str] = None

class OfferCounter(BaseModel):
    counter_amount: float
    note: Optional[str] = None

class OfferResponse(BaseModel):
    id: int
    product_id: int
    buyer_id: int
    seller_id: int
    amount: float
    counter_amount: Optional[float] = None
    note: Optional[str] = None
    status: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    buyer: Optional[UserResponse] = None
    seller: Optional[UserResponse] = None
    product_title: Optional[str] = None
    product_price: Optional[float] = None
    product_image: Optional[str] = None

    class Config:
        from_attributes = True
