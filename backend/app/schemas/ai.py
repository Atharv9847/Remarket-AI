from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class PriceEstimateRequest(BaseModel):
    title: Optional[str] = None
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    condition: Optional[str] = "Good"
    original_price: Optional[float] = None
    attributes: Optional[Dict[str, Any]] = {}

class ComparableListing(BaseModel):
    id: int
    title: str
    price: float
    condition: str
    year: Optional[int] = None
    image_url: Optional[str] = None

class PriceEstimateResponse(BaseModel):
    suggested_min: float
    suggested_max: float
    median_price: float
    confidence_score: float
    fair_market_price: float
    factors: Dict[str, Any]
    comparable_listings: List[ComparableListing] = []
    disclaimer: str

class ConditionAnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None

class DetectedSignal(BaseModel):
    component: str # e.g. "Screen", "Edges / Body", "Ports", "Wear"
    finding: str
    severity: str # "Clean", "Minor", "Moderate", "Noticeable"

class ConditionAnalysisResponse(BaseModel):
    suggested_condition: str # "Brand New", "Like New", "Good", "Fair", "Needs Repair"
    confidence: float
    cosmetic_score: float # 1-10
    detected_signals: List[DetectedSignal]
    recommendation: str
    disclaimer: str

class SmartSearchRequest(BaseModel):
    query: str

class SmartSearchResponse(BaseModel):
    original_query: str
    extracted_category: Optional[str] = None
    extracted_brand: Optional[str] = None
    extracted_condition: Optional[str] = None
    max_budget: Optional[float] = None
    min_budget: Optional[float] = None
    purpose: Optional[str] = None
    near_me: bool = False
    cleaned_keywords: str

class ListingGenerateRequest(BaseModel):
    raw_notes: str
    category_hint: Optional[str] = None

class ListingGenerateResponse(BaseModel):
    suggested_title: str
    structured_description: str
    suggested_category: str
    suggested_category_id: Optional[int] = None
    suggested_brand: Optional[str] = None
    suggested_model: Optional[str] = None
    suggested_year: Optional[int] = None
    suggested_condition: str
    suggested_tags: List[str]
    suggested_price_range: Dict[str, float]
    extracted_attributes: Dict[str, Any]

class RiskAssessmentResponse(BaseModel):
    risk_level: str # "LOW", "MODERATE", "ELEVATED"
    is_flagged: bool
    warning_message: Optional[str] = None
    risk_signals: List[str] = []
