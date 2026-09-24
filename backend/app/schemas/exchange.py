from pydantic import BaseModel
from typing import Optional
import datetime
from app.schemas.user import UserResponse
from app.schemas.product import ProductResponse

class ExchangeProposalCreate(BaseModel):
    product_id: int
    offered_product_id: int
    additional_amount: Optional[float] = 0.0 # positive = offer extra cash, negative = ask for cash
    message: Optional[str] = None

class ExchangeProposalResponse(BaseModel):
    id: int
    product_id: int
    proposer_id: int
    offered_product_id: int
    additional_amount: float
    message: Optional[str] = None
    status: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    target_product: Optional[ProductResponse] = None
    offered_product: Optional[ProductResponse] = None
    proposer: Optional[UserResponse] = None

    class Config:
        from_attributes = True
