import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "GoBengali"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # JWT — no default; must be set via environment variable
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Gemini
    GEMINI_API_KEY: str = ""

    # ML Models
    MODEL_CACHE_DIR: str = "./models"
    TRANSLATION_MODEL: str = ""  # Disabled for stability testing
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


def _load_settings() -> Settings:
    """Load settings, validating that required env vars are present."""
    try:
        return Settings()
    except Exception as e:
        # Provide a clear error message if SECRET_KEY is missing
        if "SECRET_KEY" in str(e):
            raise RuntimeError(
                "SECRET_KEY environment variable is required. "
                "Set it in your .env file or environment: "
                "SECRET_KEY=<your-random-secret-at-least-32-chars>"
            ) from e
        raise


settings = _load_settings()
