"""
Grammar Endpoint - Routes to Grammar Service
Uses modular Grammar Service (mT5 + IndicBERT)
"""
from fastapi import APIRouter, HTTPException
import logging

from ..schemas import GrammarCheckRequest, GrammarCheckResponse
from services.grammar.model import get_grammar_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/check", response_model=GrammarCheckResponse)
async def check_grammar(request_data: GrammarCheckRequest):
    """
    Check grammar using dedicated Grammar Service.
    Primary: mT5 (Google) | Fallback: IndicBERT (ai4bharat)
    """
    try:
        service = get_grammar_service()
        
        if not service.primary_ready and not service.fallback_ready:
            raise HTTPException(
                status_code=503,
                detail="Grammar service still loading. Please wait."
            )
        
        errors = await service.check_grammar(request_data.text)
        
        # Apply corrections to generate corrected text
        corrected_text = request_data.text
        for error in sorted(errors, key=lambda x: x['offset'], reverse=True):
            if error.get('suggestions'):
                before = corrected_text[:error['offset']]
                after = corrected_text[error['offset'] + error['length']:]
                corrected_text = before + error['suggestions'][0] + after
        
        return GrammarCheckResponse(
            errors=errors,
            corrected_text=corrected_text
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Grammar check failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

