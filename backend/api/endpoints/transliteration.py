from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class TransliterateRequest(BaseModel):
    text: str
    max_suggestions: int = 4

class TransliterationSuggestion(BaseModel):
    text: str
    score: float

class TransliterateResponse(BaseModel):
    suggestions: List[TransliterationSuggestion]

# English to Bengali transliteration map
TRANSLITERATION_MAP = {
    # Common words
    "richard": ["রিচার্ড", "রিসার্ড", "রিচার্ডু", "রিক্কার্ড"],
    "oru": ["ওরু", "ওড়ু", "অরু"],
    "nalla": ["নাল্লা", "নালা", "নাল্লু"],
    
    # Names
    "john": ["জন", "জোন", "জোহন"],
    "mary": ["মেরি", "মারি", "মেরী"],
    "david": ["ডেভিড", "দাউদ", "ডেভিড"],
    
    # Common English words
    "hello": ["হ্যালো", "হেলো", "হ্যাল্লো"],
    "world": ["ওয়ার্ল্ড", "বিশ্ব", "ওয়ার্ল্ড"],
    "good": ["গুড", "ভালো", "গুড"],
    "morning": ["মর্নিং", "সকাল", "মর্নিঙ"],
    "night": ["নাইট", "রাত্রি", "নাইট"],
    "yes": ["ইয়েস", "হ্যাঁ", "ইয়েছ"],
    "no": ["নো", "না", "নৌ"],
    
    # Numbers
    "one": ["এক", "ওয়ান", "এক"],
    "two": ["দুই", "টু", "দুই"],
    "three": ["তিন", "থ্রি", "তিন"],
    "hundred": ["শত", "হানড্রেড", "শতক"],
    
    # Phonetic patterns
    "ka": ["কা", "ক", "কা"],
    "ki": ["কি", "কী", "কি"],
    "ku": ["কু", "কূ", "কু"],
    "ga": ["গা", "গ", "গা"],
    "cha": ["চা", "ছা", "চা"],
    "ja": ["জা", "যা", "জা"],
    "ta": ["টা", "তা", "ত"],
    "da": ["ডা", "দা", "দ"],
    "na": ["না", "ণা", "ন"],
    "pa": ["পা", "প", "পা"],
    "ba": ["বা", "ব", "বা"],
    "ma": ["মা", "ম", "মা"],
    "ra": ["রা", "র", "রা"],
    "la": ["লা", "ল", "লা"],
    "sha": ["শা", "ষা", "স"],
    "sa": ["সা", "শা", "স"],
}

@router.post("/transliterate", response_model=TransliterateResponse)
async def transliterate_text(request: TransliterateRequest):
    """
    Convert English text to Bengali script with multiple suggestions.
    Returns top suggestions ranked by relevance.
    """
    try:
        text_lower = request.text.lower().strip()
        
        # Check if we have predefined transliterations
        if text_lower in TRANSLITERATION_MAP:
            suggestions = TRANSLITERATION_MAP[text_lower][:request.max_suggestions]
            return TransliterateResponse(
                suggestions=[
                    TransliterationSuggestion(text=s, score=1.0 - (i * 0.1))
                    for i, s in enumerate(suggestions)
                ]
            )
        
        # If no match, try to build from phonetic patterns
        suggestions = await _phonetic_transliteration(text_lower)
        
        return TransliterateResponse(
            suggestions=suggestions[:request.max_suggestions]
        )
    
    except Exception as e:
        logger.error(f"Transliteration failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Transliteration failed: {str(e)}")

async def _phonetic_transliteration(text: str) -> List[TransliterationSuggestion]:
    """
    Build transliteration from phonetic patterns.
    This is a simplified version - in production, use a proper transliteration model.
    """
    # Simple character mapping
    char_map = {
        'a': 'আ', 'b': 'ব', 'c': 'ক', 'd': 'ড',
        'e': 'এ', 'f': 'ফ', 'g': 'গ', 'h': 'হ',
        'i': 'ই', 'j': 'জ', 'k': 'ক', 'l': 'ল',
        'm': 'ম', 'n': 'ন', 'o': 'ও', 'p': 'প',
        'q': 'ক', 'r': 'র', 's': 'স', 't': 'ট',
        'u': 'উ', 'v': 'ভ', 'w': 'ও', 'x': 'ক্স',
        'y': 'ই', 'z': 'জ'
    }
    
    # Simple phonetic transliteration
    result = ''.join([char_map.get(c, c) for c in text])
    
    return [
        TransliterationSuggestion(text=result, score=0.6),
        TransliterationSuggestion(text=result + "্", score=0.4)
    ]

