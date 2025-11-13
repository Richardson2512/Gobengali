"""
Analysis Endpoint - Combined Analysis Using All Services
Coordinates Translation, Grammar, and Spelling services
"""
from fastapi import APIRouter, HTTPException
import logging
from langdetect import detect

from ..schemas import AnalyzeRequest, AnalyzeResponse, CorrectionError
from services.translation.model import get_translation_service
from services.grammar.model import get_grammar_service
from services.spelling.model import get_spelling_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request_data: AnalyzeRequest):
    """
    Combined analysis using all independent services:
    1. Language detection (langdetect - lightweight)
    2. Translation to Bengali (Translation Service - NLLB-200)
    3. Grammar checking (Grammar Service - mT5)
    4. Spelling checking (Spelling Service - SymSpell)
    
    Each service is independent - if one fails, others continue working.
    """
    try:
        # 1. Detect language (lightweight, always available)
        try:
            detected = detect(request_data.text)
            lang_map = {'en': 'eng_Latn', 'bn': 'ben_Beng', 'hi': 'hin_Deva'}
            detected_lang = lang_map.get(detected, 'eng_Latn')
        except:
            detected_lang = "eng_Latn"
        
        logger.info(f"Detected language: {detected_lang}")
        
        # 2. Translate if needed (using Translation Service)
        translated_text = request_data.text
        if detected_lang != "ben_Beng":
            translation_service = get_translation_service()
            if translation_service.ready:
                result = await translation_service.translate(
                    request_data.text,
                    source_lang=detected_lang,
                    target_lang="ben_Beng"
                )
                if result:
                    translated_text = result
                else:
                    logger.warning("Translation failed, using original text")
            else:
                logger.warning("Translation service not ready, using original text")
        
        errors = []
        
        # 3. Check spelling (using Spelling Service)
        if request_data.check_spelling:
            spelling_service = get_spelling_service()
            if spelling_service.primary_ready or spelling_service.fallback_ready:
                spelling_errors = await spelling_service.check_spelling(translated_text)
                errors.extend(spelling_errors)
            else:
                logger.warning("Spelling service not ready, skipping")
        
        # 4. Check grammar (using Grammar Service)
        if request_data.check_grammar:
            grammar_service = get_grammar_service()
            if grammar_service.primary_ready or grammar_service.fallback_ready:
                grammar_errors = await grammar_service.check_grammar(translated_text)
                errors.extend(grammar_errors)
            else:
                logger.warning("Grammar service not ready, skipping")
        
        # Calculate statistics
        word_count = len(translated_text.split())
        char_count = len(translated_text)
        
        logger.info(f"Analysis complete: {len(errors)} errors found")
        
        return AnalyzeResponse(
            translated_text=translated_text,
            detected_language=detected_lang,
            errors=errors,
            word_count=word_count,
            char_count=char_count
        )
    
    except Exception as e:
        logger.error(f"Analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

