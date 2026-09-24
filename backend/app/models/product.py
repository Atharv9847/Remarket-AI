import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    subcategory_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    brand = Column(String(100), nullable=True, index=True)
    model = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    condition = Column(String(50), nullable=False, index=True) # "Brand New", "Like New", "Good", "Fair", "Needs Repair"
    price = Column(Float, nullable=False, index=True)
    original_price = Column(Float, nullable=True)
    negotiable = Column(Boolean, default=True)
    exchange_available = Column(Boolean, default=False)
    delivery_available = Column(Boolean, default=False)
    location = Column(String(150), nullable=True, default="Bengaluru")
    latitude = Column(Float, nullable=True, default=12.9716)
    longitude = Column(Float, nullable=True, default=77.5946)
    status = Column(String(30), default="active", index=True) # "active", "draft", "sold", "under_review", "rejected"
    views = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    attributes = Column(JSON, nullable=True, default={}) # category specific specs e.g. ram, storage, mileage, size
    tags = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    seller = relationship("User", back_populates="products")
    category = relationship("Category", foreign_keys=[category_id], back_populates="products")
    subcategory = relationship("Category", foreign_keys=[subcategory_id])
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    offers = relationship("Offer", back_populates="product", cascade="all, delete-orphan")
    exchanges = relationship("ExchangeProposal", foreign_keys="ExchangeProposal.product_id", back_populates="product", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product")
    conversations = relationship("Conversation", back_populates="product")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="images")
