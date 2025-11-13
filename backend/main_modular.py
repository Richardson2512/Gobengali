"""
GoBengali Backend - Modular Architecture
Each AI model runs as independent service with dedicated endpoints.

Services:
1. Translation Service (NLLB-200) - /api/translation/*
2. Grammar Service (mT5 + IndicBERT) - /api/grammar/*
3. Spelling Service (SymSpell + LanguageTool) - /api/spelling/*
4. Transliteration Service (indic-transliteration) - /api/transliteration/*

Each service loads independently - if one fails, others continue working!
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import asyncio

from config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager - loads all services independently"""
    logger.info("=" * 80)
    logger.info("🚀 Starting GoBengali - Modular AI Backend")
    logger.info("=" * 80)
    
    # Load services in parallel (non-blocking)
    load_tasks = []
    
    # 1. Transliteration (lightweight, loads instantly)
    logger.info("📝 Initializing Transliteration Service (indic-transliteration)...")
    from services.transliteration.model import get_transliteration_service
    translit_service = get_transliteration_service()
    
    # 2. Translation (heavy, load in background)
    logger.info("🌐 Starting Translation Service (NLLB-200) in background...")
    from services.translation.model import load_translation_service
    load_tasks.append(asyncio.create_task(load_translation_service()))
    
    # 3. Grammar (heavy, load in background)
    logger.info("📚 Starting Grammar Service (mT5 + IndicBERT) in background...")
    from services.grammar.model import load_grammar_service
    load_tasks.append(asyncio.create_task(load_grammar_service()))
    
    # 4. Spelling (medium, load in background)
    logger.info("✍️ Starting Spelling Service (SymSpell + LanguageTool) in background...")
    from services.spelling.model import load_spelling_service
    load_tasks.append(asyncio.create_task(load_spelling_service()))
    
    logger.info("=" * 80)
    logger.info("✅ API is READY! (AI models loading in background...)")
    logger.info("=" * 80)
    logger.info("📝 Transliteration: READY (instant)")
    logger.info("🌐 Translation: Loading... (30-60s)")
    logger.info("📚 Grammar: Loading... (30-60s)")
    logger.info("✍️ Spelling: Loading... (10-20s)")
    logger.info("=" * 80)
    
    # Let services load in background
    # API is responsive immediately, heavy models load async
    
    yield
    
    # Shutdown
    logger.info("Shutting down services...")
    
    # Cancel pending loads
    for task in load_tasks:
        if not task.done():
            task.cancel()
    
    # Cleanup services
    try:
        from services.translation.model import get_translation_service
        get_translation_service().cleanup()
    except:
        pass
    
    try:
        from services.grammar.model import get_grammar_service
        get_grammar_service().cleanup()
    except:
        pass
    
    try:
        from services.spelling.model import get_spelling_service
        get_spelling_service().cleanup()
    except:
        pass

# Create FastAPI app
app = FastAPI(
    title="GoBengali - Modular AI Backend",
    version="2.0.0",
    description="AI-Powered Bengali Writing Assistant with Independent Services",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include service routers with dedicated prefixes
from services.transliteration import router as transliteration_router
from services.translation import router as translation_router
from services.grammar import router as grammar_router
from services.spelling import router as spelling_router

app.include_router(transliteration_router, prefix="/api", tags=["Transliteration"])
app.include_router(translation_router, prefix="/api", tags=["Translation"])
app.include_router(grammar_router, prefix="/api", tags=["Grammar"])
app.include_router(spelling_router, prefix="/api", tags=["Spelling"])

# Also include old API router for compatibility
from api import router as legacy_router
app.include_router(legacy_router, prefix="/api", tags=["Legacy"])

@app.get("/")
async def root():
    return {
        "name": "GoBengali",
        "version": "2.0.0",
        "architecture": "modular",
        "status": "running",
        "message": "Modular AI backend - each service independent!"
    }

@app.get("/health")
async def health_check():
    """Overall health check"""
    from services.transliteration.model import get_transliteration_service
    from services.translation.model import get_translation_service
    from services.grammar.model import get_grammar_service
    from services.spelling.model import get_spelling_service
    
    translit = get_transliteration_service()
    translation = get_translation_service()
    grammar = get_grammar_service()
    spelling = get_spelling_service()
    
    return {
        "status": "healthy",
        "version": "2.0.0",
        "services": {
            "transliteration": {
                "status": "ready" if translit.ready else "unavailable",
                "library": "indic-transliteration"
            },
            "translation": {
                "status": "ready" if translation.ready else "loading",
                "model": "NLLB-200"
            },
            "grammar": {
                "status": "ready" if (grammar.primary_ready or grammar.fallback_ready) else "loading",
                "primary": "mT5" if grammar.primary_ready else "loading",
                "fallback": "IndicBERT" if grammar.fallback_ready else "not loaded"
            },
            "spelling": {
                "status": "ready" if (spelling.primary_ready or spelling.fallback_ready) else "loading",
                "primary": "SymSpell" if spelling.primary_ready else "loading",
                "fallback": "LanguageTool" if spelling.fallback_ready else "not loaded"
            }
        },
        "message": "All services running independently!"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting GoBengali Modular Backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

