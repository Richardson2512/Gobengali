"""
Translation API Router
Dedicated endpoint for NLLB-200 translation service
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

from .model import get_translation_service

router = APIRouter()
logger = logging.getLogger(__name__)

class TranslateRequest(BaseModel):
    text: str
    source_lang: Optional[str] = "eng_Latn"
    target_lang: Optional[str] = "ben_Beng"

class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str

class DetectLanguageRequest(BaseModel):
    text: str

class DetectLanguageResponse(BaseModel):
    language: str
    confidence: float

@router.post("/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """
    Translate text using NLLB-200 AI model.
    Primary model: facebook/nllb-200-distilled-1.3B
    """
    try:
        service = get_translation_service()
        
        if not service.ready:
            raise HTTPException(
                status_code=503,
                detail="Translation service not ready. Models still loading."
            )
        
        translated = await service.translate(
            request.text,
            request.source_lang,
            request.target_lang
        )
        
        if translated is None:
            raise HTTPException(
                status_code=500,
                detail="Translation failed"
            )
        
        return TranslateResponse(
            translated_text=translated,
            source_lang=request.source_lang,
            target_lang=request.target_lang
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Translation endpoint failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect-language", response_model=DetectLanguageResponse)
async def detect_language(request: DetectLanguageRequest):
    """Detect language of input text"""
    try:
        from langdetect import detect
        
        detected = detect(request.text)
        
        # Map langdetect codes to NLLB codes
        lang_map = {
            'en': 'eng_Latn',
            'bn': 'ben_Beng',
            'hi': 'hin_Deva',
            'ur': 'urd_Arab',
            'ar': 'arb_Arab',
        }
        
        nllb_lang = lang_map.get(detected, 'eng_Latn')
        
        return DetectLanguageResponse(
            language=nllb_lang,
            confidence=0.95
        )
    
    except Exception as e:
        logger.error(f"Language detection failed: {e}")
        # Default to English
        return DetectLanguageResponse(
            language='eng_Latn',
            confidence=0.5
        )

@router.get("/translation/health")
async def translation_health():
    """Health check for translation service"""
    service = get_translation_service()
    return {
        "service": "translation",
        "status": "healthy" if service.ready else "loading",
        "model": service.model_name,
        "device": service.device,
        "ready": service.ready
    }

