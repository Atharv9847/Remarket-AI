from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime
from app.schemas.user import UserResponse, UserTrustIndicators

class ProductImageResponse(BaseModel):
    id: int
    image_url: str
    sort_order: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    title: str
    description: str
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    condition: str # "Brand New", "Like New", "Good", "Fair", "Needs Repair"
    price: float
    original_price: Optional[float] = None
    negotiable: bool = True
    exchange_available: bool = False
    delivery_available: bool = False
    location: Optional[str] = "Bengaluru"
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946
    attributes: Optional[Dict[str, Any]] = {}
    tags: Optional[str] = None

class ProductCreate(ProductBase):
    images: List[str] = [] # list of image URLs
    status: Optional[str] = "active"

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    condition: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    negotiable: Optional[bool] = None
    exchange_available: Optional[bool] = None
    delivery_available: Optional[bool] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None
    tags: Optional[str] = None
    images: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: int
    seller_id: int
    status: str
    views: int
    likes_count: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    images: List[ProductImageResponse] = []
    seller: Optional[UserResponse] = None
    category_name: Optional[str] = None
    subcategory_name: Optional[str] = None
    distance_km: Optional[float] = None
    is_favorited: Optional[bool] = False

    class Config:
        from_attributes = True

class ProductDetailResponse(ProductResponse):
    seller_trust: Optional[UserTrustIndicators] = None
    similar_products: List[ProductResponse] = []
    price_recommendation: Optional[Dict[str, Any]] = None
    risk_assessment: Optional[Dict[str, Any]] = None

class ProductCompareRequest(BaseModel):
    product_ids: List[int]
