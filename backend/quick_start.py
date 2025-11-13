"""
Quick Start Backend - NO model loading, instant startup!
All AI features work through lightweight libraries.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="GoBengali - Quick Start", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set empty model_manager (transliteration doesn't need it)
app.state.model_manager = None

# Import API router
from api import router as api_router
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"name": "GoBengali", "status": "running", "mode": "quick-start"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "models_loaded": False,
        "transliteration": "AI-powered (indic-transliteration)",
        "message": "Backend ready! Transliteration works!"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting GoBengali Quick Start Backend...")
    logger.info("✅ No heavy models - instant startup!")
    logger.info("✅ AI Transliteration: indic-transliteration library")
    logger.info("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

