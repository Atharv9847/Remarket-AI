from pydantic import BaseModel
from typing import Optional, List

class SubcategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    status: bool

    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    parent_id: Optional[int] = None
    description: Optional[str] = None
    image: Optional[str] = None
    icon: Optional[str] = "Tag"
    status: bool
    subcategories: List[SubcategoryResponse] = []
    product_count: Optional[int] = 0

    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    parent_id: Optional[int] = None
    description: Optional[str] = None
    image: Optional[str] = None
    icon: Optional[str] = "Tag"
