"""
Production Lite - Works without downloading models first
Models will download on-demand when first used
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os

from config import settings
from api import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Model manager will be lazy-loaded
model_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager - models load on first request"""
    logger.info("="* 70)
    logger.info("Starting GoBengali Production Server (Lite Mode)")
    logger.info("Models will download on first request")
    logger.info("=" * 70)
    
    app.state.model_manager = None  # Lazy load
    
    yield
    
    # Cleanup
    logger.info("Shutting down...")
    if app.state.model_manager:
        await app.state.model_manager.cleanup()

# Create FastAPI app
app = FastAPI(
    title="GoBengali",
    version="1.0.0",
    description="AI-Powered Bengali Writing Assistant",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy load model manager
async def get_model_manager():
    """Lazy-load model manager on first use"""
    if app.state.model_manager is None:
        logger.info("First request - loading models...")
        logger.info("This will take 2-3 minutes (one-time setup)")
        
        try:
            from models.production_model_manager import ProductionModelManager
            
            manager = ProductionModelManager(
                translation_model_name=settings.TRANSLATION_MODEL,
                grammar_model_name="google/mt5-small",
                grammar_fallback_name="ai4bharat/IndicBERTv2-MLM-only",
                use_gpu=settings.USE_GPU,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            
            await manager.load_models()
            app.state.model_manager = manager
            logger.info("Models loaded successfully!")
            
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            # Fall back to mock manager for now
            logger.warning("Falling back to mock manager for this session")
            from models.model_manager import ModelManager
            manager = ModelManager(
                translation_model_name=settings.TRANSLATION_MODEL,
                grammar_model_name=settings.GRAMMAR_MODEL,
                use_gpu=False
            )
            app.state.model_manager = manager
    
    return app.state.model_manager

# Include API routes (without /api prefix to match existing structure)
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "name": "GoBengali",
        "version": "1.0.0",
        "status": "running",
        "mode": "production-lite",
        "message": "Backend is ready! Models load on first use."
    }

@app.get("/health")
async def health_check():
    """Health check"""
    models_loaded = app.state.model_manager is not None
    
    return {
        "status": "healthy",
        "models_loaded": models_loaded,
        "version": "1.0.0",
        "message": "Ready" if models_loaded else "Models will load on first request"
    }

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting server on http://localhost:8000")
    logger.info("Models will download on first API call (if not cached)")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

