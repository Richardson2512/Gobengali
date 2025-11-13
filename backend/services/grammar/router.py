"""
Grammar API Router
Dedicated endpoint for mT5/IndicBERT grammar service
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging

from .model import get_grammar_service

router = APIRouter()
logger = logging.getLogger(__name__)

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
    """
    Check grammar using AI models.
    Primary: mT5 (Google)
    Fallback: IndicBERT (ai4bharat)
    """
    try:
        service = get_grammar_service()
        
        if not service.primary_ready and not service.fallback_ready:
            raise HTTPException(
                status_code=503,
                detail="Grammar service not ready. Models still loading."
            )
        
        errors = await service.check_grammar(request.text)
        
        # Determine which model was used
        model_used = "mT5" if service.primary_ready else "IndicBERT"
        
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
    """Health check for grammar service"""
    service = get_grammar_service()
    return {
        "service": "grammar",
        "primary_model": service.primary_model_name,
        "primary_ready": service.primary_ready,
        "fallback_model": service.fallback_model_name,
        "fallback_ready": service.fallback_ready,
        "status": "healthy" if (service.primary_ready or service.fallback_ready) else "loading"
    }

