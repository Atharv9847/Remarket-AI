from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import datetime
from app.schemas.user import UserResponse

class MessageCreate(BaseModel):
    conversation_id: Optional[int] = None
    receiver_id: int
    product_id: Optional[int] = None
    message: str
    message_type: Optional[str] = "text"
    payload: Optional[Dict[str, Any]] = None

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    receiver_id: int
    product_id: Optional[int] = None
    message_type: str
    message: str
    payload: Optional[Dict[str, Any]] = None
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    product_id: int
    buyer_id: int
    seller_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    last_message: Optional[MessageResponse] = None
    other_user: Optional[UserResponse] = None
    product_title: Optional[str] = None
    product_image: Optional[str] = None
    product_price: Optional[float] = None
    unread_count: int = 0

    class Config:
        from_attributes = True
