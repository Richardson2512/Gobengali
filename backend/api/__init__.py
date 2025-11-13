from fastapi import APIRouter
from .endpoints import translation, grammar, spelling, analysis, auth, transliteration

router = APIRouter()

# Include all endpoint routers
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(translation.router, tags=["Translation"])
router.include_router(grammar.router, tags=["Grammar"])
router.include_router(spelling.router, tags=["Spelling"])
router.include_router(analysis.router, tags=["Analysis"])
router.include_router(transliteration.router, tags=["Transliteration"])

