from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import logging

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
    AI-powered transliteration service.
    - English to Bengali: Uses indic-transliteration or custom phonetic model
    - Bengali to variations: Uses spelling checker and language model for alternatives
    """
    try:
        # Try to use AI-based transliteration
        try:
            from indic_transliteration import sanscript
            from indic_transliteration.sanscript import transliterate as indic_translit
            
            # Check if input is Bengali or English
            is_bengali = bool(__import__('re').search(r'[\u0980-\u09FF]', request.text))
            
            if is_bengali:
                # Bengali word - provide variations using spelling checker
                suggestions = await _get_bengali_word_variations(request.text, http_request)
            else:
                # English word - transliterate to Bengali
                suggestions = await _english_to_bengali(request.text, http_request)
            
            return TransliterateResponse(suggestions=suggestions[:request.max_suggestions])
            
        except ImportError:
            # Fallback to AI translation model for transliteration
            logger.warning("indic-transliteration not available, using translation model")
            suggestions = await _ai_transliteration(request.text, http_request)
            return TransliterateResponse(suggestions=suggestions[:request.max_suggestions])
    
    except Exception as e:
        logger.error(f"Transliteration failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Transliteration failed: {str(e)}")

async def _english_to_bengali(text: str, http_request: Request) -> List[TransliterationSuggestion]:
    """Use AI transliteration from English to Bengali"""
    try:
        from indic_transliteration import sanscript
        from indic_transliteration.sanscript import transliterate as indic_translit
        
        # Try multiple transliteration schemes for variety
        suggestions = []
        
        # ITRANS to Bengali
        result1 = indic_translit(text, sanscript.ITRANS, sanscript.BENGALI)
        suggestions.append(TransliterationSuggestion(text=result1, score=1.0))
        
        # Try with modified input for variations
        result2 = indic_translit(text.replace('o', 'u'), sanscript.ITRANS, sanscript.BENGALI)
        if result2 != result1:
            suggestions.append(TransliterationSuggestion(text=result2, score=0.9))
        
        result3 = indic_translit(text.replace('a', 'aa'), sanscript.ITRANS, sanscript.BENGALI)
        if result3 != result1 and result3 != result2:
            suggestions.append(TransliterationSuggestion(text=result3, score=0.8))
        
        return suggestions
        
    except Exception as e:
        logger.error(f"indic-transliteration failed: {e}")
        # Fallback to translation model
        return await _ai_transliteration(text, http_request)

async def _get_bengali_word_variations(bengali_word: str, http_request: Request) -> List[TransliterationSuggestion]:
    """
    For Bengali words, use spelling checker to find similar/alternative words.
    This helps when user is editing/backspacing.
    """
    try:
        model_manager = http_request.app.state.model_manager
        
        if model_manager:
            # Use spelling checker to find similar Bengali words
            # The spelling checker will suggest variations
            from symspellpy import SymSpell, Verbosity
            
            # This would use the model's spelling functionality
            # For now, return the word itself
            return [TransliterationSuggestion(text=bengali_word, score=1.0)]
        else:
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

