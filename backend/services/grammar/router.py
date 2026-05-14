"""
Grammar API Router
Dedicated endpoint for mT5/IndicBERT grammar service
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging

from .model import get_grammar_service, load_grammar_service

router = APIRouter()
logger = logging.getLogger(__name__)

_loaded = False

class GrammarError(BaseModel):
    type: str
    offset: int
    length: int
    original_text: str
    suggestions: List[str]
    message: str
    reason: str
    confidence: float

class GrammarCheckRequest(BaseModel):
    text: str

class GrammarCheckResponse(BaseModel):
    errors: List[GrammarError]
    checked_by: str  # "mT5" or "IndicBERT"

@router.post("/check-grammar", response_model=GrammarCheckResponse)
async def check_grammar(request: GrammarCheckRequest):
    global _loaded
    try:
        if not _loaded:
            await load_grammar_service()
            _loaded = True

        service = get_grammar_service()

        if not service.primary_ready and not service.fallback_ready:
            return GrammarCheckResponse(errors=[], checked_by="none")

        errors = await service.check_grammar(request.text)
        model_used = "Gemini" if service.primary_ready else "fallback"

        return GrammarCheckResponse(
            errors=errors,
            checked_by=model_used
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Grammar check endpoint failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/grammar/health")
async def grammar_health():
    service = get_grammar_service()
    return {
        "service": "grammar",
        "primary_ready": service.primary_ready,
        "fallback_ready": service.fallback_ready,
        "status": "healthy" if (service.primary_ready or service.fallback_ready) else "not_configured"
    }

