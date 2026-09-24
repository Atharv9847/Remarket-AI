import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class ExchangeProposal(Base):
    __tablename__ = "exchange_proposals"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    proposer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    offered_product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    additional_amount = Column(Float, default=0.0) # Cash offset: +buyer pays, -buyer asks
    message = Column(Text, nullable=True)
    status = Column(String(30), default="PENDING", index=True) # PENDING, ACCEPTED, REJECTED, COUNTERED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    product = relationship("Product", foreign_keys=[product_id], back_populates="exchanges")
    offered_product = relationship("Product", foreign_keys=[offered_product_id])
    proposer = relationship("User", foreign_keys=[proposer_id], back_populates="exchanges_proposed")
