"""
Grammar Endpoint - Routes to Grammar Service
"""
from fastapi import APIRouter, HTTPException
import logging

from ..schemas import GrammarCheckRequest, GrammarCheckResponse
from services.grammar.model import get_grammar_service, load_grammar_service

router = APIRouter()
logger = logging.getLogger(__name__)
_loaded = False


@router.post("/check", response_model=GrammarCheckResponse)
async def check_grammar(request_data: GrammarCheckRequest):
    global _loaded
    try:
        if not _loaded:
            await load_grammar_service()
            _loaded = True

        service = get_grammar_service()

        if not service.primary_ready:
            return GrammarCheckResponse(errors=[], corrected_text=request_data.text)

        errors = await service.check_grammar(request_data.text)

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

