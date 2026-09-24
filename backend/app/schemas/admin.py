from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import datetime
from app.schemas.user import UserResponse
from app.schemas.product import ProductResponse
from app.schemas.report import ReportResponse

class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    new_users_30d: int
    total_listings: int
    active_listings: int
    sold_listings: int
    total_transactions: int
    total_transaction_volume: float
    total_reports: int
    open_reports: int
    popular_categories: List[Dict[str, Any]]
    recent_transactions: List[Dict[str, Any]]
    activity_trends: List[Dict[str, Any]]

class AdminUserUpdate(BaseModel):
    status: Optional[str] = None
    role: Optional[str] = None

class AdminListingAction(BaseModel):
    status: str # "active", "rejected", "under_review"
    reason: Optional[str] = None
