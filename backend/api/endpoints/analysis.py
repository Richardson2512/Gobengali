from fastapi import APIRouter, HTTPException, Request
import logging

from ..schemas import AnalyzeRequest, AnalyzeResponse, CorrectionError

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request_data: AnalyzeRequest, request: Request):
    """
    Main analysis endpoint that performs:
    1. Language detection
    2. Translation to Bengali (if needed)
    3. Grammar checking
    4. Spelling checking
    
    Returns translated text with all detected errors.
    """
    try:
        model_manager = request.app.state.model_manager
        
        # If model_manager is None, return simple mock response
        if model_manager is None:
            logger.warning("Model manager not loaded, using simple fallback")
            return AnalyzeResponse(
                translated_text=request_data.text,
                detected_language="eng_Latn",
                errors=[],
                word_count=len(request_data.text.split()),
                char_count=len(request_data.text)
            )
        
        # Detect language
        detected_lang = await model_manager.detect_language(request_data.text)
        logger.info(f"Detected language: {detected_lang}")
        
        # Translate to Bengali if not already Bengali
        if detected_lang != "ben_Beng":
            translated_text = await model_manager.translate(
                request_data.text,
                source_lang=detected_lang,
                target_lang="ben_Beng"
            )
        else:
            translated_text = request_data.text
        
        errors = []
        
        # Check spelling
        if request_data.check_spelling:
            spelling_errors = await model_manager.check_spelling(translated_text)
            errors.extend(spelling_errors)
        
        # Check grammar
        if request_data.check_grammar:
            grammar_errors = await model_manager.check_grammar(translated_text)
            errors.extend(grammar_errors)
        
        # Calculate statistics
        word_count = len(translated_text.split())
        char_count = len(translated_text)
        
        return AnalyzeResponse(
            translated_text=translated_text,
            detected_language=detected_lang,
            errors=errors,
            word_count=word_count,
            char_count=char_count
        )
    
    except Exception as e:
        logger.error(f"Analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

