"""
Translation Endpoint - Routes to Translation Service
Uses modular Translation Service (NLLB-200)
"""
from fastapi import APIRouter, HTTPException
import logging
from langdetect import detect, DetectorFactory

from ..schemas import (
    TranslateRequest,
    TranslateResponse,
    DetectLanguageRequest,
    DetectLanguageResponse,
)
from ..constants import langdetect_to_nllb
from services.translation.model import get_translation_service

# Make langdetect deterministic
DetectorFactory.seed = 0

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/translate", response_model=TranslateResponse)
async def translate_text(request_data: TranslateRequest):
    """
    Translate text using dedicated Translation Service (NLLB-200).
    Service loads independently - won't crash other features.
    """
    try:
        service = get_translation_service()

        if not service.ready:
            raise HTTPException(
                status_code=503,
                detail="Translation service still loading. Please wait 30-60 seconds.",
            )

        # Detect source language if not provided
        if not request_data.source_lang:
            detected = detect(request_data.text)
            detected_lang = langdetect_to_nllb(detected)
        else:
            detected_lang = request_data.source_lang

        # Use dedicated translation service
        translated_text = await service.translate(
            request_data.text,
            source_lang=detected_lang,
            target_lang=request_data.target_lang,
        )

        if translated_text is None:
            raise HTTPException(status_code=500, detail="Translation failed")

        return TranslateResponse(
            translated_text=translated_text,
            detected_language=detected_lang,
            confidence=service.last_confidence,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Translation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect-language", response_model=DetectLanguageResponse)
async def detect_language(request_data: DetectLanguageRequest):
    """
    Detect language using langdetect library (lightweight, no heavy model needed).
    """
    try:
        detected = detect(request_data.text)
        detected_lang = langdetect_to_nllb(detected)

        return DetectLanguageResponse(
            language=detected_lang,
            confidence=0.85,
        )

    except Exception as e:
        logger.error(f"Language detection failed: {e}")
        return DetectLanguageResponse(
            language="eng_Latn",
            confidence=0.5,
        )
