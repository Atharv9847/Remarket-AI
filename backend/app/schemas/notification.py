from pydantic import BaseModel
from typing import Optional
import datetime

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    message: str
    link: Optional[str] = None
    read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True
