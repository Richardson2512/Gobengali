from fastapi import APIRouter, HTTPException, Request
import logging

from ..schemas import SpellingCheckRequest, SpellingCheckResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/check", response_model=SpellingCheckResponse)
async def check_spelling(request_data: SpellingCheckRequest, request: Request):
    """
    Check spelling in Bengali text.
    Uses BSpell (CNN + BERT) model.
    """
    try:
        model_manager = request.app.state.model_manager
        
        errors = await model_manager.check_spelling(request_data.text)
        
        # Apply corrections to generate corrected text
        corrected_text = request_data.text
        for error in sorted(errors, key=lambda x: x['offset'], reverse=True):
            if error['suggestions']:
                before = corrected_text[:error['offset']]
                after = corrected_text[error['offset'] + error['length']:]
                corrected_text = before + error['suggestions'][0] + after
        
        return SpellingCheckResponse(
            errors=errors,
            corrected_text=corrected_text
        )
    
    except Exception as e:
        logger.error(f"Spelling check failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Spelling check failed: {str(e)}")

