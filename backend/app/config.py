import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ReMarket - Second-Hand AI Marketplace"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database (defaults to SQLite for local zero-config, or PostgreSQL in production)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/marketplace.db")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_2026_remarket_prod_secure")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Uploads
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
    MAX_FILE_SIZE: int = 15 * 1024 * 1024 # 15MB
    
    # AI settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "hybrid_engine")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
