import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON
from app.database import Base

class AiPricePrediction(Base):
    __tablename__ = "ai_price_predictions"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    predicted_min = Column(Float, nullable=False)
    predicted_max = Column(Float, nullable=False)
    model_version = Column(String(50), default="v1.0-statistical-quantile")
    factors = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AiConditionAnalysis(Base):
    __tablename__ = "ai_condition_analysis"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    image_url = Column(String(500), nullable=False)
    detected_signals = Column(JSON, nullable=False)
    confidence = Column(Float, default=0.92)
    suggested_condition = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
