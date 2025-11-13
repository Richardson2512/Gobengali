"""
Transliteration API Router
Dedicated endpoint for transliteration service
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
import re

from .model import get_transliteration_service

router = APIRouter()
logger = logging.getLogger(__name__)

class TransliterateRequest(BaseModel):
    text: str
    max_suggestions: int = 4
    reverse: Optional[bool] = False

class TransliterationSuggestion(BaseModel):
    text: str
    score: float

class TransliterateResponse(BaseModel):
    suggestions: List[TransliterationSuggestion]

@router.post("/transliterate", response_model=TransliterateResponse)
async def transliterate_text(request: TransliterateRequest):
    """
    AI-powered transliteration endpoint.
    - English -> Bengali: Uses indic-transliteration AI
    - Bengali -> Variations: Uses reverse transliteration
    
    Returns multiple suggestions for user to choose from.
    """
    try:
        service = get_transliteration_service()
        
        if not service.ready:
            logger.error("Transliteration service not available")
            return TransliterateResponse(suggestions=[])
        
        # Detect if input is Bengali or English
        is_bengali = bool(re.search(r'[\u0980-\u09FF]', request.text))
        
        if is_bengali:
            # Bengali word - provide variations
            logger.info(f"Generating variations for Bengali: {request.text}")
            results = service.bengali_to_variations(request.text, request.max_suggestions)
        else:
            # English word - transliterate to Bengali
            logger.info(f"Transliterating English to Bengali: {request.text}")
            results = service.english_to_bengali(request.text, request.max_suggestions)
        
        # Convert to response format
        suggestions = [
            TransliterationSuggestion(text=text, score=score)
            for text, score in results
        ]
        
        logger.info(f"Returning {len(suggestions)} suggestions")
        return TransliterateResponse(suggestions=suggestions)
    
    except Exception as e:
        logger.error(f"Transliteration endpoint failed: {e}", exc_info=True)
        # Return empty instead of crashing
        return TransliterateResponse(suggestions=[])

@router.get("/transliterate/health")
async def transliteration_health():
    """Health check for transliteration service"""
    service = get_transliteration_service()
    return {
        "service": "transliteration",
        "status": "healthy" if service.ready else "unavailable",
        "library": "indic-transliteration" if service.ready else "not loaded",
        "ready": service.ready
    }

