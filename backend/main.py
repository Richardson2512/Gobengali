from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from config import settings
from api import router as api_router

# Configure logging first
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Try production models first, fall back to basic if needed
try:
    from models.production_model_manager import ProductionModelManager as ModelManager
    USE_PRODUCTION = True
    logger.info("✓ Using ProductionModelManager (Full AI with mT5 + BSpell)")
except ImportError as e:
    from models.model_manager import ModelManager
    USE_PRODUCTION = False
    logger.warning(f"Production manager not available: {e}")
    logger.info("Using basic ModelManager")

# Global model manager instance
model_manager: ModelManager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for FastAPI app"""
    global model_manager
    
    # Startup: Load ML models
    logger.info("Starting GoBengali API server...")
    logger.info("Loading ML models...")
    
    try:
        if USE_PRODUCTION:
            # Production mode - with fallbacks
            model_manager = ModelManager(
                translation_model_name=settings.TRANSLATION_MODEL,
                grammar_model_name="google/mt5-small",
                grammar_fallback_name="ai4bharat/IndicBERTv2-MLM-only",
                use_gpu=settings.USE_GPU,
                cache_dir=settings.MODEL_CACHE_DIR
            )
        else:
            # Basic mode
            model_manager = ModelManager(
                translation_model_name=settings.TRANSLATION_MODEL,
                grammar_model_name=settings.GRAMMAR_MODEL,
                use_gpu=settings.USE_GPU,
                cache_dir=settings.MODEL_CACHE_DIR
            )
        
        await model_manager.load_models()
        app.state.model_manager = model_manager
        logger.info("=" * 70)
        logger.info("✅ ML models loaded successfully!")
        logger.info("=" * 70)
    except Exception as e:
        logger.error(f"Failed to load ML models: {e}", exc_info=True)
        logger.warning("API will run with limited functionality")
        app.state.model_manager = None
    
    yield
    
    # Shutdown: Cleanup
    logger.info("Shutting down GoBengali API server...")
    if model_manager:
        await model_manager.cleanup()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Bengali Writing Assistant API",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs" if settings.DEBUG else "disabled"
    }

# Health check
@app.get("/health")
async def health_check():
    models_loaded = hasattr(app.state, 'model_manager') and app.state.model_manager is not None
    
    return {
        "status": "healthy",
        "models_loaded": models_loaded,
        "version": settings.APP_VERSION
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )

