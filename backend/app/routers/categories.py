from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryResponse, CategoryCreate, SubcategoryResponse
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    # Fetch root categories (parent_id is None)
    categories = db.query(Category).filter(Category.parent_id == None, Category.status == True).all()
    results = []
    for cat in categories:
        subcats = db.query(Category).filter(Category.parent_id == cat.id, Category.status == True).all()
        # Count products under this category
        product_count = db.query(Product).filter(
            Product.category_id == cat.id,
            Product.status == "active"
        ).count()
        
        results.append({
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "parent_id": cat.parent_id,
            "description": cat.description,
            "image": cat.image,
            "icon": cat.icon or "Tag",
            "status": cat.status,
            "subcategories": subcats,
            "product_count": product_count
        })
    return results

@router.post("", response_model=CategoryResponse)
def create_category(cat_in: CategoryCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    slug = cat_in.slug or cat_in.name.lower().replace(" ", "-").replace("&", "and")
    cat = Category(
        name=cat_in.name,
        slug=slug,
        parent_id=cat_in.parent_id,
        description=cat_in.description,
        image=cat_in.image,
        icon=cat_in.icon,
        status=True
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {
        "id": cat.id,
        "name": cat.name,
        "slug": cat.slug,
        "parent_id": cat.parent_id,
        "description": cat.description,
        "image": cat.image,
        "icon": cat.icon,
        "status": cat.status,
        "subcategories": [],
        "product_count": 0
    }
