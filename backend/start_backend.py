"""
Lightweight backend with AI transliteration - starts fast!
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from models.model_manager import ModelManager
from config import settings

model_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models at startup"""
    global model_manager
    
    logger.info("Starting GoBengali API...")
    logger.info("Loading AI models (lightweight mode)...")
    
    try:
        model_manager = ModelManager(
            translation_model_name=settings.TRANSLATION_MODEL,
            grammar_model_name=settings.GRAMMAR_MODEL,
            use_gpu=False,
            cache_dir=settings.MODEL_CACHE_DIR
        )
        await model_manager.load_models()
        app.state.model_manager = model_manager
        logger.info("✅ Models loaded!")
    except Exception as e:
        logger.warning(f"Model loading failed: {e}")
        app.state.model_manager = None
    
    yield
    
    if model_manager:
        await model_manager.cleanup()

app = FastAPI(
    title="GoBengali",
    version="1.0.0",
    description="AI-Powered Bengali Writing Assistant",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api import router as api_router
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"name": "GoBengali", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": model_manager is not None,
        "message": "Backend ready with AI transliteration!"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting GoBengali backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000)

