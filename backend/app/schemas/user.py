from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = "Bengaluru, India"
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946
    bio: Optional[str] = None

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None

class UserResponse(UserBase):
    id: int
    profile_image: Optional[str] = None
    email_verified: bool
    phone_verified: bool
    role: str
    status: str
    response_rate: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class UserTrustIndicators(BaseModel):
    user_id: int
    name: str
    profile_image: Optional[str] = None
    member_since: datetime.datetime
    email_verified: bool
    phone_verified: bool
    completed_transactions: int
    average_rating: float
    total_reviews: int
    response_rate: int
    active_listings_count: int

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
