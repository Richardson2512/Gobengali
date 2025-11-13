"""
Spelling API Router
Dedicated endpoint for spelling service
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging

from .model import get_spelling_service

router = APIRouter()
logger = logging.getLogger(__name__)

class SpellingError(BaseModel):
    type: str
    offset: int
    length: int
    original_text: str
    suggestions: List[str]
    message: str
    reason: str
    confidence: float

class SpellingCheckRequest(BaseModel):
    text: str

class SpellingCheckResponse(BaseModel):
    errors: List[SpellingError]
    checked_by: str  # "SymSpell" or "LanguageTool"

@router.post("/check-spelling", response_model=SpellingCheckResponse)
async def check_spelling(request: SpellingCheckRequest):
    """
    Check spelling using AI models.
    Primary: SymSpell with AI fuzzy matching
    Fallback: LanguageTool with ML rules
    """
    try:
        service = get_spelling_service()
        
        if not service.primary_ready and not service.fallback_ready:
            raise HTTPException(
                status_code=503,
                detail="Spelling service not ready. Models still loading."
            )
        
        errors = await service.check_spelling(request.text)
        
        # Determine which model was used
        model_used = "SymSpell" if service.primary_ready else "LanguageTool"
        
        return SpellingCheckResponse(
            errors=errors,
            checked_by=model_used
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Spelling check endpoint failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/spelling/health")
async def spelling_health():
    """Health check for spelling service"""
    service = get_spelling_service()
    return {
        "service": "spelling",
        "primary": "SymSpell",
        "primary_ready": service.primary_ready,
        "fallback": "LanguageTool",
        "fallback_ready": service.fallback_ready,
        "status": "healthy" if (service.primary_ready or service.fallback_ready) else "loading"
    }

