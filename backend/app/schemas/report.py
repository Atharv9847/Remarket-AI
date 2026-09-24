from pydantic import BaseModel
from typing import Optional
import datetime
from app.schemas.user import UserResponse

class ReportCreate(BaseModel):
    product_id: Optional[int] = None
    reported_user_id: Optional[int] = None
    reason: str
    description: str

class ReportResponse(BaseModel):
    id: int
    reported_by: int
    product_id: Optional[int] = None
    reported_user_id: Optional[int] = None
    reason: str
    description: str
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime.datetime
    resolved_at: Optional[datetime.datetime] = None
    reporter: Optional[UserResponse] = None
    reported_user: Optional[UserResponse] = None
    product_title: Optional[str] = None

    class Config:
        from_attributes = True
