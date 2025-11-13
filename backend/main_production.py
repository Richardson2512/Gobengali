"""
Production Main File - Full AI Backend
Uses real AI models with intelligent fallbacks
NO hardcoded data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import os

from config import settings
from api import router as api_router
from models.production_model_manager import ProductionModelManager

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global model manager instance
model_manager: ProductionModelManager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for FastAPI app"""
    global model_manager
    
    # Startup: Load ML models
    logger.info("=" * 70)
    logger.info("🚀 Starting GoBengali Production API Server")
    logger.info("=" * 70)
    
    try:
        model_manager = ProductionModelManager(
            translation_model_name=settings.TRANSLATION_MODEL,
            grammar_model_name=os.getenv("GRAMMAR_MODEL", "google/mt5-small"),
            grammar_fallback_name=os.getenv("GRAMMAR_FALLBACK", "ai4bharat/IndicBERTv2-MLM-only"),
            use_gpu=settings.USE_GPU,
            cache_dir=settings.MODEL_CACHE_DIR,
            model_timeout=float(os.getenv("MODEL_TIMEOUT", "5.0"))
        )
        
        logger.info("\n📦 Loading AI models (this may take 1-2 minutes)...")
        await model_manager.load_models()
        
        app.state.model_manager = model_manager
        
        logger.info("\n" + "=" * 70)
        logger.info("✅ GoBengali is ready!")
        logger.info("=" * 70)
        logger.info(f"🌐 API available at: http://{settings.API_HOST}:{settings.API_PORT}")
        logger.info(f"📚 Docs at: http://{settings.API_HOST}:{settings.API_PORT}/docs")
        logger.info("=" * 70 + "\n")
        
    except Exception as e:
        logger.error(f"❌ Failed to load models: {e}", exc_info=True)
        logger.error("Server will exit - fix the errors and restart")
        raise
    
    yield
    
    # Shutdown: Cleanup
    logger.info("\n🛑 Shutting down GoBengali API server...")
    if model_manager:
        await model_manager.cleanup()
    logger.info("✅ Shutdown complete")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production AI-Powered Bengali Writing Assistant",
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

# Include API routes
app.include_router(api_router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "mode": "production",
        "message": "GoBengali Production API - Fully AI-Powered"
    }

# Health check with model status
@app.get("/health")
async def health_check():
    """Health check endpoint with model status"""
    if not model_manager:
        return {
            "status": "starting",
            "models_loaded": False,
            "version": settings.APP_VERSION,
            "message": "Models are loading..."
        }
    
    return {
        "status": "healthy",
        "models_loaded": True,
        "version": settings.APP_VERSION,
        "mode": "production",
        "models": {
            "translation": model_manager.translation_model is not None,
            "grammar_primary": model_manager.grammar_model is not None,
            "grammar_fallback": model_manager.grammar_fallback_model is not None,
            "spelling_primary": model_manager.bspell_checker is not None,
            "spelling_fallback": model_manager.language_tool is not None
        },
        "device": model_manager.device,
        "message": "Production API ready with full AI models"
    }

# Metrics endpoint
@app.get("/metrics")
async def get_metrics():
    """Get model usage metrics"""
    if not model_manager:
        raise HTTPException(status_code=503, detail="Models not loaded yet")
    
    metrics = model_manager.get_metrics()
    
    total_grammar = metrics['grammar_primary_uses'] + metrics['grammar_fallback_uses']
    total_spelling = metrics['spelling_primary_uses'] + metrics['spelling_fallback_uses']
    
    return {
        "grammar": {
            "total_checks": total_grammar,
            "primary_uses": metrics['grammar_primary_uses'],
            "fallback_uses": metrics['grammar_fallback_uses'],
            "primary_rate": f"{(metrics['grammar_primary_uses'] / total_grammar * 100):.1f}%" if total_grammar > 0 else "N/A",
            "primary_available": metrics['grammar_primary_available'],
            "fallback_available": metrics['grammar_fallback_available']
        },
        "spelling": {
            "total_checks": total_spelling,
            "primary_uses": metrics['spelling_primary_uses'],
            "fallback_uses": metrics['spelling_fallback_uses'],
            "primary_rate": f"{(metrics['spelling_primary_uses'] / total_spelling * 100):.1f}%" if total_spelling > 0 else "N/A",
            "primary_available": metrics['spelling_primary_available'],
            "fallback_available": metrics['spelling_fallback_available']
        }
    }

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "type": type(exc).__name__
        }
    )

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🚀 Starting GoBengali Production Server...")
    logger.info(f"   Mode: Production (Full AI)")
    logger.info(f"   GPU: {'Enabled' if settings.USE_GPU else 'Disabled'}")
    
    uvicorn.run(
        app,
        host=settings.API_HOST,
        port=settings.API_PORT,
        log_level="info" if settings.DEBUG else "warning"
    )

