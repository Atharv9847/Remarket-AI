import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    counter_amount = Column(Float, nullable=True)
    note = Column(Text, nullable=True)
    status = Column(String(30), default="PENDING", index=True) # PENDING, ACCEPTED, REJECTED, COUNTERED, EXPIRED, CANCELLED
    parent_offer_id = Column(Integer, ForeignKey("offers.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="offers")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="offers_made")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="offers_received")
