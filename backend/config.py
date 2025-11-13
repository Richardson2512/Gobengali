from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "GoBengali"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0

    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "gobengali"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ML Models
    MODEL_CACHE_DIR: str = "./models"
    TRANSLATION_MODEL: str = "facebook/nllb-200-distilled-1.3B"
    GRAMMAR_MODEL: str = "ai4bharat/IndicBERTv2-MLM-only"
    SPELLING_MODEL: str = "custom-bspell"

    # Rate Limits
    FREE_TIER_DAILY_WORDS: int = 1000
    PRO_TIER_DAILY_WORDS: int = 999999

    # Model Settings
    USE_GPU: bool = False
    MAX_LENGTH: int = 512
    BATCH_SIZE: int = 8

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

