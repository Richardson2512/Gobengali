"""
AI-Powered Transliteration using indic-transliteration library
NO hardcoded data - pure AI transliteration
"""
import logging
from typing import List, Tuple

logger = logging.getLogger(__name__)

class TransliterationService:
    """
    Handles English <-> Bengali transliteration using AI library.
    Uses indic-transliteration (professional Indic language AI)
    """
    
    def __init__(self):
        self.ready = False
        try:
            from indic_transliteration import sanscript
            from indic_transliteration.sanscript import transliterate
            self.sanscript = sanscript
            self.transliterate = transliterate
            self.ready = True
            logger.info("✅ Transliteration service initialized (indic-transliteration)")
        except ImportError as e:
            logger.error(f"Failed to load indic-transliteration: {e}")
            logger.error("Install with: pip install indic-transliteration")
            self.ready = False
    
    def english_to_bengali(self, text: str, max_suggestions: int = 4) -> List[Tuple[str, float]]:
        """
        Transliterate English text to Bengali script.
        Returns list of (bengali_text, confidence_score)
        """
        if not self.ready:
            logger.error("Transliteration service not ready")
            return []
        
        try:
            suggestions = []
            
            # Primary: ITRANS scheme (most accurate for phonetic)
            result1 = self.transliterate(text, self.sanscript.ITRANS, self.sanscript.BENGALI)
            suggestions.append((result1, 1.0))
            
            # Variation 1: Try replacing 'o' with 'u' for different pronunciation
            if 'o' in text.lower():
                variant = text.lower().replace('o', 'u')
                result2 = self.transliterate(variant, self.sanscript.ITRANS, self.sanscript.BENGALI)
                if result2 != result1:
                    suggestions.append((result2, 0.9))
            
            # Variation 2: Try long 'a' (aa) for different pronunciation
            if 'a' in text.lower() and len(text) > 2:
                variant = text.lower().replace('a', 'aa')
                result3 = self.transliterate(variant, self.sanscript.ITRANS, self.sanscript.BENGALI)
                if result3 not in [s[0] for s in suggestions]:
                    suggestions.append((result3, 0.85))
            
            # Variation 3: Try HK scheme as alternative
            try:
                result4 = self.transliterate(text, self.sanscript.HK, self.sanscript.BENGALI)
                if result4 not in [s[0] for s in suggestions]:
                    suggestions.append((result4, 0.8))
            except Exception:
                pass
            
            # Variation 4: Try SLP1 scheme
            try:
                result5 = self.transliterate(text, self.sanscript.SLP1, self.sanscript.BENGALI)
                if result5 not in [s[0] for s in suggestions]:
                    suggestions.append((result5, 0.75))
            except Exception:
                pass
            
            logger.info(f"Generated {len(suggestions)} transliteration suggestions for '{text}'")
            return suggestions[:max_suggestions]
            
        except Exception as e:
            logger.error(f"Transliteration failed for '{text}': {e}", exc_info=True)
            return []
    
    def bengali_to_variations(self, bengali_text: str, max_suggestions: int = 4) -> List[Tuple[str, float]]:
        """
        For Bengali text being edited, provide alternative spellings/variations.
        Uses reverse transliteration and phonetic variations.
        """
        if not self.ready:
            return [(bengali_text, 1.0)]
        
        try:
            suggestions = [(bengali_text, 1.0)]
            
            # Try reverse transliteration to get romanized form
            try:
                # Bengali to ITRANS
                roman = self.transliterate(bengali_text, self.sanscript.BENGALI, self.sanscript.ITRANS)
                
                # Now generate variations of the romanized text
                variations = [roman, roman + 'a', roman + 'i', roman.replace('a', 'aa')]
                
                for var in variations:
                    result = self.transliterate(var, self.sanscript.ITRANS, self.sanscript.BENGALI)
                    if result not in [s[0] for s in suggestions] and result != bengali_text:
                        suggestions.append((result, 0.8))
                        if len(suggestions) >= max_suggestions:
                            break
            except Exception as e:
                logger.debug(f"Reverse transliteration failed: {e}")
            
            return suggestions[:max_suggestions]
            
        except Exception as e:
            logger.error(f"Bengali variation generation failed: {e}")
            return [(bengali_text, 1.0)]

# Global instance
_service = None

def get_transliteration_service() -> TransliterationService:
    """Get or create transliteration service instance"""
    global _service
    if _service is None:
        _service = TransliterationService()
    return _service

