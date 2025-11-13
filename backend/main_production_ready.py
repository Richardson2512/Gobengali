"""
Production Ready - Loads models at startup
Models are already downloaded, so this starts quickly
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os
import sys

from config import settings
from api import router as api_router

# Configure logging  
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

model_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models at startup"""
    global model_manager
    
    logger.info("=" * 70)
    logger.info("Starting GoBengali Production Server")
    logger.info("=" * 70)
    logger.info("Loading AI models (30-60 seconds)...")
    
    try:
        # Try production model manager first
        try:
            from models.production_model_manager import ProductionModelManager
            
            model_manager = ProductionModelManager(
                translation_model_name=settings.TRANSLATION_MODEL,
                grammar_model_name="google/mt5-small",
                grammar_fallback_name="ai4bharat/IndicBERTv2-MLM-only",
                use_gpu=settings.USE_GPU,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            
            await model_manager.load_models()
            logger.info("=" * 70)
            logger.info("SUCCESS - All AI models loaded!")
            logger.info("=" * 70)
            
        except Exception as e:
            logger.warning(f"Production models failed: {e}")
            logger.info("Falling back to basic model manager...")
            
            # Fall back to basic manager
            from models.model_manager import ModelManager
            model_manager = ModelManager(
                translation_model_name=settings.TRANSLATION_MODEL,
                grammar_model_name=settings.GRAMMAR_MODEL,
                use_gpu=False
            )
            await model_manager.load_models()
            logger.info("Basic models loaded")
        
        app.state.model_manager = model_manager
        logger.info("Server ready at http://0.0.0.0:8000")
        
    except Exception as e:
        logger.error(f"CRITICAL: Failed to load models: {e}")
        logger.error("Server will exit")
        sys.exit(1)
    
    yield
    
    # Cleanup
    logger.info("Shutting down...")
    if model_manager:
        await model_manager.cleanup()

# Create app
app = FastAPI(
    title="GoBengali",
    version="1.0.0",
    description="AI-Powered Bengali Writing Assistant - Production",
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

# Include API routes
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "name": "GoBengali",
        "version": "1.0.0",
        "status": "running",
        "mode": "production",
        "message": "Full AI Production Backend"
    }

@app.get("/health")
async def health_check():
    """Health check with model status"""
    has_production = hasattr(model_manager, 'grammar_fallback_model')
    
    return {
        "status": "healthy",
        "models_loaded": model_manager is not None,
        "version": "1.0.0",
        "mode": "production" if has_production else "basic",
        "models": {
            "translation": model_manager.translation_model is not None if model_manager else False,
            "grammar_primary": model_manager.grammar_model is not None if (model_manager and has_production) else False,
            "grammar_fallback": model_manager.grammar_fallback_model is not None if (model_manager and has_production) else False,
            "spelling_primary": model_manager.bspell_checker is not None if (model_manager and has_production) else False,
            "spelling_fallback": model_manager.language_tool is not None if (model_manager and has_production) else False
        } if has_production else {"note": "Using basic models"},
        "device": model_manager.device if model_manager else "unknown",
        "message": "Production AI models ready" if has_production else "Basic models ready"
    }

@app.get("/metrics")
async def get_metrics():
    """Get usage metrics"""
    if not model_manager:
        return {"error": "Models not loaded"}
    
    if hasattr(model_manager, 'get_metrics'):
        return model_manager.get_metrics()
    else:
        return {"message": "Metrics not available in basic mode"}

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting GoBengali Production Server...")
    logger.info("Models will load at startup (30-60 seconds)")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

