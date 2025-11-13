from fastapi import APIRouter, HTTPException, Request
import logging

from ..schemas import (
    TranslateRequest,
    TranslateResponse,
    DetectLanguageRequest,
    DetectLanguageResponse
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/translate", response_model=TranslateResponse)
async def translate_text(request_data: TranslateRequest, request: Request):
    """
    Translate text from source language to target language.
    Uses NLLB-200 model for translation.
    """
    try:
        model_manager = request.app.state.model_manager
        
        # If model_manager is None, load it now
        if model_manager is None:
            logger.info("Model manager not loaded - loading now...")
            from langdetect import detect
            detected = detect(request_data.text)
            lang_map = {'en': 'eng_Latn', 'bn': 'ben_Beng', 'hi': 'hin_Deva'}
            detected_lang = lang_map.get(detected, 'eng_Latn')
            
            # Return mock translation for now
            return TranslateResponse(
                translated_text=f"[Translation requires AI models - run setup_production.py first]",
                detected_language=detected_lang,
                confidence=0.50
            )
        
        # Detect source language if not provided
        if not request_data.source_lang:
            detected_lang = await model_manager.detect_language(request_data.text)
        else:
            detected_lang = request_data.source_lang
        
        # Translate
        translated_text = await model_manager.translate(
            request_data.text,
            source_lang=detected_lang,
            target_lang=request_data.target_lang
        )
        
        return TranslateResponse(
            translated_text=translated_text,
            detected_language=detected_lang,
            confidence=0.95  # Placeholder confidence score
        )
    
    except Exception as e:
        logger.error(f"Translation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

@router.post("/detect-language", response_model=DetectLanguageResponse)
async def detect_language(request_data: DetectLanguageRequest, request: Request):
    """
    Detect the language of input text.
    """
    try:
        model_manager = request.app.state.model_manager
        
        # If model_manager is None, use simple langdetect
        if model_manager is None:
            from langdetect import detect
            detected = detect(request_data.text)
            lang_map = {'en': 'eng_Latn', 'bn': 'ben_Beng', 'hi': 'hin_Deva'}
            detected_lang = lang_map.get(detected, 'eng_Latn')
        else:
            detected_lang = await model_manager.detect_language(request_data.text)
        
        return DetectLanguageResponse(
            language=detected_lang,
            confidence=0.95  # Placeholder confidence score
        )
    
    except Exception as e:
        logger.error(f"Language detection failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Language detection failed: {str(e)}")

