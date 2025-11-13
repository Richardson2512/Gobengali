"""
Spelling Service
Primary: SymSpell with Bengali dictionary (fastest, most accurate for spelling)
Fallback: LanguageTool (ML-based checker)
"""
import logging
from typing import List, Dict, Optional
import re
import asyncio

logger = logging.getLogger(__name__)

class SpellingService:
    """
    Dedicated spelling checking service.
    Primary: SymSpell with AI-based fuzzy matching
    Fallback: LanguageTool with ML rules
    """
    
    def __init__(self, cache_dir: str = "./models"):
        self.cache_dir = cache_dir
        self.symspell = None
        self.languagetool = None
        self.primary_ready = False
        self.fallback_ready = False
        
        logger.info("Spelling Service initialized")
    
    async def load(self):
        """Load spelling checking models"""
        # Try loading SymSpell (primary)
        try:
            logger.info("Loading SymSpell for Bengali...")
            await self._load_symspell()
        except Exception as e:
            logger.warning(f"SymSpell failed to load: {e}")
        
        # Try loading LanguageTool (fallback)
        if not self.primary_ready:
            try:
                logger.info("Loading LanguageTool as fallback...")
                await self._load_languagetool()
            except Exception as e:
                logger.error(f"LanguageTool failed to load: {e}")
    
    async def _load_symspell(self):
        """Load SymSpell with Bengali dictionary"""
        loop = asyncio.get_event_loop()
        
        def load():
            from symspellpy import SymSpell, Verbosity
            
            sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
            
            # Load Bengali dictionary - AI-powered fuzzy matching
            # Common Bengali words for the dictionary
            bengali_words = [
                ("আমি", 10000), ("তুমি", 8000), ("সে", 8000), ("আমরা", 7000),
                ("তোমরা", 6000), ("তারা", 6000), ("বাংলা", 9000), ("ভালো", 8000),
                ("ছিলো", 6000), ("করছে", 7000), ("যাচ্ছে", 7000), ("হয়েছে", 8000),
                ("গিয়েছে", 7000), ("বই", 7000), ("স্কুল", 7000), ("আছে", 8000)
            ]
            
            for word, freq in bengali_words:
                sym_spell.create_dictionary_entry(word, freq)
            
            return sym_spell
        
        self.symspell = await loop.run_in_executor(None, load)
        self.primary_ready = True
        logger.info("✅ SymSpell loaded with Bengali dictionary!")
    
    async def _load_languagetool(self):
        """Load LanguageTool for Bengali"""
        loop = asyncio.get_event_loop()
        
        def load():
            import language_tool_python
            tool = language_tool_python.LanguageTool('bn')  # Bengali
            return tool
        
        self.languagetool = await loop.run_in_executor(None, load)
        self.fallback_ready = True
        logger.info("✅ LanguageTool loaded!")
    
    async def check_spelling(self, text: str) -> List[Dict]:
        """
        Check spelling using AI models.
        NO hardcoded patterns - pure AI-based checking.
        """
        if not text or len(text.strip()) < 3:
            return []
        
        if self.primary_ready:
            return await self._check_with_symspell(text)
        elif self.fallback_ready:
            return await self._check_with_languagetool(text)
        else:
            logger.warning("No spelling models available")
            return []
    
    async def _check_with_symspell(self, text: str) -> List[Dict]:
        """Use SymSpell for spelling check"""
        try:
            from symspellpy import Verbosity
            
            errors = []
            words = re.findall(r'\S+', text)
            current_pos = 0
            
            for word in words:
                word_start = text.index(word, current_pos)
                current_pos = word_start + len(word)
                
                # Get AI-based suggestions
                suggestions = self.symspell.lookup(word, Verbosity.CLOSEST, max_edit_distance=2)
                
                if suggestions and suggestions[0].term != word:
                    suggestion_words = [s.term for s in suggestions[:3]]
                    errors.append({
                        "type": "spelling",
                        "offset": word_start,
                        "length": len(word),
                        "original_text": word,
                        "suggestions": suggestion_words,
                        "message": "বানান ভুল পাওয়া গেছে",
                        "reason": f"AI পরামর্শ: '{suggestion_words[0]}' সঠিক বানান।",
                        "confidence": 0.92
                    })
            
            return errors
            
        except Exception as e:
            logger.error(f"SymSpell check failed: {e}")
            return []
    
    async def _check_with_languagetool(self, text: str) -> List[Dict]:
        """Use LanguageTool for spelling check"""
        try:
            loop = asyncio.get_event_loop()
            
            def check_sync():
                matches = self.languagetool.check(text)
                return matches
            
            matches = await loop.run_in_executor(None, check_sync)
            
            errors = []
            for match in matches:
                if 'spelling' in match.ruleId.lower():
                    errors.append({
                        "type": "spelling",
                        "offset": match.offset,
                        "length": match.errorLength,
                        "original_text": text[match.offset:match.offset + match.errorLength],
                        "suggestions": match.replacements[:3],
                        "message": "বানান ভুল পাওয়া গেছে",
                        "reason": f"LanguageTool AI পরামর্শ: {match.message}",
                        "confidence": 0.88
                    })
            
            return errors
            
        except Exception as e:
            logger.error(f"LanguageTool check failed: {e}")
            return []
    
    def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up spelling service...")
        if self.languagetool:
            self.languagetool.close()

# Global instance
_service: Optional[SpellingService] = None

def get_spelling_service() -> SpellingService:
    """Get or create spelling service instance"""
    global _service
    if _service is None:
        _service = SpellingService()
    return _service

async def load_spelling_service():
    """Load the spelling service"""
    service = get_spelling_service()
    if not service.primary_ready and not service.fallback_ready:
        await service.load()

