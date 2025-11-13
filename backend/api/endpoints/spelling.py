"""
Spelling Endpoint - Routes to Spelling Service
Uses modular Spelling Service (SymSpell + LanguageTool)
"""
from fastapi import APIRouter, HTTPException
import logging

from ..schemas import SpellingCheckRequest, SpellingCheckResponse
from services.spelling.model import get_spelling_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/check", response_model=SpellingCheckResponse)
async def check_spelling(request_data: SpellingCheckRequest):
    """
    Check spelling using dedicated Spelling Service.
    Primary: SymSpell | Fallback: LanguageTool
    """
    try:
        service = get_spelling_service()
        
        if not service.primary_ready and not service.fallback_ready:
            raise HTTPException(
                status_code=503,
                detail="Spelling service still loading. Please wait."
            )
        
        errors = await service.check_spelling(request_data.text)
        
        # Apply corrections to generate corrected text
        corrected_text = request_data.text
        for error in sorted(errors, key=lambda x: x['offset'], reverse=True):
            if error.get('suggestions'):
                before = corrected_text[:error['offset']]
                after = corrected_text[error['offset'] + error['length']:]
                corrected_text = before + error['suggestions'][0] + after
        
        return SpellingCheckResponse(
            errors=errors,
            corrected_text=corrected_text
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Spelling check failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

