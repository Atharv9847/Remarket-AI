import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    password_hash = Column(String(255), nullable=False)
    profile_image = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String(150), nullable=True, default="Bengaluru, India")
    latitude = Column(Float, nullable=True, default=12.9716)
    longitude = Column(Float, nullable=True, default=77.5946)
    email_verified = Column(Boolean, default=True)
    phone_verified = Column(Boolean, default=True)
    role = Column(String(20), default="user") # "user", "admin"
    status = Column(String(20), default="active") # "active", "suspended"
    response_rate = Column(Integer, default=95) # percentage
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    products = relationship("Product", back_populates="seller", cascade="all, delete-orphan")
    offers_made = relationship("Offer", foreign_keys="Offer.buyer_id", back_populates="buyer")
    offers_received = relationship("Offer", foreign_keys="Offer.seller_id", back_populates="seller")
    exchanges_proposed = relationship("ExchangeProposal", foreign_keys="ExchangeProposal.proposer_id", back_populates="proposer")
    reviews_given = relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer")
    reviews_received = relationship("Review", foreign_keys="Review.reviewee_id", back_populates="reviewee")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
