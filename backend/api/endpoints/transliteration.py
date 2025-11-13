from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import logging
import re

router = APIRouter()
logger = logging.getLogger(__name__)

class TransliterateRequest(BaseModel):
    text: str
    max_suggestions: int = 4
    reverse: Optional[bool] = False  # For Bengali to English suggestions

class TransliterationSuggestion(BaseModel):
    text: str
    score: float

class TransliterateResponse(BaseModel):
    suggestions: List[TransliterationSuggestion]

@router.post("/transliterate", response_model=TransliterateResponse)
async def transliterate_text(request: TransliterateRequest, http_request: Request):
    """
    AI-powered transliteration service using indic-transliteration library.
    - English to Bengali: Uses ITRANS scheme
    - Bengali to variations: Uses model-based suggestions
    """
    try:
        # Check if input is Bengali or English
        is_bengali = bool(re.search(r'[\u0980-\u09FF]', request.text))
        
        if is_bengali:
            # Bengali word - use AI model for variations
            suggestions = await _get_bengali_word_variations(request.text, http_request)
        else:
            # English word - use indic-transliteration
            suggestions = await _english_to_bengali(request.text, http_request)
        
        return TransliterateResponse(suggestions=suggestions[:request.max_suggestions])
    
    except Exception as e:
        logger.error(f"Transliteration failed: {e}", exc_info=True)
        # Return empty instead of raising error
        return TransliterateResponse(suggestions=[])

async def _english_to_bengali(text: str, http_request: Request) -> List[TransliterationSuggestion]:
    """Use AI transliteration from English to Bengali"""
    suggestions = []
    
    try:
        from indic_transliteration import sanscript
        from indic_transliteration.sanscript import transliterate as indic_translit
        
        logger.info(f"Transliterating: {text}")
        
        # ITRANS to Bengali (most common scheme)
        result1 = indic_translit(text, sanscript.ITRANS, sanscript.BENGALI)
        suggestions.append(TransliterationSuggestion(text=result1, score=1.0))
        logger.info(f"ITRANS result: {result1}")
        
        # Try different vowel variations for more options
        if 'o' in text:
            result2 = indic_translit(text.replace('o', 'u'), sanscript.ITRANS, sanscript.BENGALI)
            if result2 != result1:
                suggestions.append(TransliterationSuggestion(text=result2, score=0.9))
        
        if 'a' in text and len(text) > 2:
            result3 = indic_translit(text.replace('a', 'aa'), sanscript.ITRANS, sanscript.BENGALI)
            if result3 not in [s.text for s in suggestions]:
                suggestions.append(TransliterationSuggestion(text=result3, score=0.8))
        
        # Try HK scheme as alternative
        try:
            result4 = indic_translit(text, sanscript.HK, sanscript.BENGALI)
            if result4 not in [s.text for s in suggestions]:
                suggestions.append(TransliterationSuggestion(text=result4, score=0.7))
        except:
            pass
        
        logger.info(f"Generated {len(suggestions)} suggestions")
        return suggestions
        
    except ImportError as e:
        logger.warning(f"indic-transliteration not installed: {e}")
        # Fallback to translation model
        return await _ai_transliteration(text, http_request)
    except Exception as e:
        logger.error(f"Transliteration failed: {e}", exc_info=True)
        # Fallback to translation model
        return await _ai_transliteration(text, http_request)

async def _get_bengali_word_variations(bengali_word: str, http_request: Request) -> List[TransliterationSuggestion]:
    """
    For Bengali words being edited, use AI spelling checker to find alternatives.
    """
    try:
        model_manager = http_request.app.state.model_manager
        
        if model_manager:
            # Use spelling checker to get variations (it will give suggestions for similar words)
            spelling_errors = await model_manager.check_spelling(bengali_word)
            
            suggestions = [TransliterationSuggestion(text=bengali_word, score=1.0)]
            
            # Add spelling suggestions as variations
            for error in spelling_errors:
                for suggestion in error.get('suggestions', [])[:3]:
                    if suggestion != bengali_word:
                        suggestions.append(TransliterationSuggestion(text=suggestion, score=0.85))
            
            return suggestions[:4]
        else:
            # No model available - just return the word
            return [TransliterationSuggestion(text=bengali_word, score=1.0)]
            
    except Exception as e:
        logger.warning(f"Bengali variation lookup failed: {e}")
        return [TransliterationSuggestion(text=bengali_word, score=1.0)]

async def _ai_transliteration(text: str, http_request: Request) -> List[TransliterationSuggestion]:
    """
    Use translation model for transliteration as fallback.
    Translates English word to Bengali.
    """
    try:
        model_manager = http_request.app.state.model_manager
        
        if not model_manager:
            # No AI available
            return []
        
        # Use translation model
        translated = await model_manager.translate(
            text,
            source_lang="eng_Latn",
            target_lang="ben_Beng"
        )
        
        return [
            TransliterationSuggestion(text=translated, score=0.85)
        ]
        
    except Exception as e:
        logger.error(f"AI transliteration failed: {e}")
        return []

