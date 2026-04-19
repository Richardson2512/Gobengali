"""
Spelling Service
Primary: SymSpell with Bengali dictionary (fastest, most accurate for spelling)
Fallback: LanguageTool (ML-based checker)
"""
import asyncio
import logging
import re
import threading
from typing import Dict, List, Optional

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
        try:
            logger.info("Loading SymSpell for Bengali...")
            await self._load_symspell()
        except Exception as e:
            logger.warning(f"SymSpell failed to load: {e}")

        if not self.primary_ready:
            try:
                logger.info("Loading LanguageTool as fallback...")
                await self._load_languagetool()
            except Exception as e:
                logger.error(f"LanguageTool failed to load: {e}")

    async def _load_symspell(self):
        """Load SymSpell with Bengali dictionary"""
        loop = asyncio.get_running_loop()

        def load():
            from symspellpy import SymSpell

            import os

            sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)

            dict_path = os.path.join(
                os.path.dirname(__file__), "bengali_dictionary.txt"
            )

            # Core dictionary with frequencies
            bengali_words = [
                ("\u0986\u09ae\u09bf", 10000),
                ("\u09a4\u09c1\u09ae\u09bf", 8000),
                ("\u09b8\u09c7", 8000),
                ("\u0986\u09ae\u09b0\u09be", 7000),
                ("\u09a4\u09cb\u09ae\u09b0\u09be", 6000),
                ("\u09a4\u09be\u09b0\u09be", 6000),
                ("\u09ac\u09be\u0982\u09b2\u09be", 9000),
                ("\u09ad\u09be\u09b2\u09cb", 8000),
                ("\u099b\u09bf\u09b2\u09cb", 6000),
                ("\u0995\u09b0\u099b\u09c7", 7000),
                ("\u09af\u09be\u099a\u09cd\u099b\u09c7", 7000),
                ("\u09b9\u09df\u09c7\u099b\u09c7", 8000),
                ("\u0997\u09bf\u09df\u09c7\u099b\u09c7", 7000),
                ("\u09ac\u0987", 7000),
                ("\u09b8\u09cd\u0995\u09c1\u09b2", 7000),
                ("\u0986\u099b\u09c7", 8000),
            ]
            for word, freq in bengali_words:
                sym_spell.create_dictionary_entry(word, freq)

            if os.path.exists(dict_path):
                with open(dict_path, "r", encoding="utf-8") as f:
                    for line in f:
                        word = line.strip()
                        if word:
                            sym_spell.create_dictionary_entry(word, 1)
                logger.info(f"Loaded {sym_spell.word_count} words into SymSpell")
            else:
                logger.warning(f"Dictionary file not found at {dict_path}")

            return sym_spell

        self.symspell = await loop.run_in_executor(None, load)
        self.primary_ready = True
        logger.info("SymSpell loaded with Bengali dictionary!")

    async def _load_languagetool(self):
        """Load LanguageTool for Bengali"""
        loop = asyncio.get_running_loop()

        def load():
            import language_tool_python

            tool = language_tool_python.LanguageTool("bn")
            return tool

        self.languagetool = await loop.run_in_executor(None, load)
        self.fallback_ready = True
        logger.info("LanguageTool loaded!")

    async def check_spelling(self, text: str) -> List[Dict]:
        """Check spelling using available service."""
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
            words = re.findall(r"\S+", text)
            current_pos = 0

            for word in words:
                word_start = text.index(word, current_pos)
                current_pos = word_start + len(word)

                suggestions = self.symspell.lookup(
                    word, Verbosity.CLOSEST, max_edit_distance=2
                )

                if suggestions and suggestions[0].term != word:
                    suggestion_words = [s.term for s in suggestions[:3]]
                    errors.append(
                        {
                            "type": "spelling",
                            "offset": word_start,
                            "length": len(word),
                            "original_text": word,
                            "suggestions": suggestion_words,
                            "message": "\u09ac\u09be\u09a8\u09be\u09a8 \u09ad\u09c1\u09b2 \u09aa\u09be\u0993\u09df\u09be \u0997\u09c7\u099b\u09c7",
                            "reason": f"AI \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6: '{suggestion_words[0]}' \u09b8\u09a0\u09bf\u0995 \u09ac\u09be\u09a8\u09be\u09a8\u0964",
                            "confidence": 0.92,
                        }
                    )

            return errors

        except Exception as e:
            logger.error(f"SymSpell check failed: {e}")
            return []

    async def _check_with_languagetool(self, text: str) -> List[Dict]:
        """Use LanguageTool for spelling check"""
        try:
            loop = asyncio.get_running_loop()

            def check_sync():
                return self.languagetool.check(text)

            matches = await loop.run_in_executor(None, check_sync)

            errors = []
            for match in matches:
                if "spelling" in match.ruleId.lower():
                    errors.append(
                        {
                            "type": "spelling",
                            "offset": match.offset,
                            "length": match.errorLength,
                            "original_text": text[
                                match.offset : match.offset + match.errorLength
                            ],
                            "suggestions": match.replacements[:3],
                            "message": "\u09ac\u09be\u09a8\u09be\u09a8 \u09ad\u09c1\u09b2 \u09aa\u09be\u0993\u09df\u09be \u0997\u09c7\u099b\u09c7",
                            "reason": f"LanguageTool AI \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6: {match.message}",
                            "confidence": 0.88,
                        }
                    )

            return errors

        except Exception as e:
            logger.error(f"LanguageTool check failed: {e}")
            return []

    def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up spelling service...")
        if self.languagetool:
            self.languagetool.close()


# Thread-safe singleton
_service: Optional[SpellingService] = None
_lock = threading.Lock()


def get_spelling_service() -> SpellingService:
    """Get or create spelling service instance (thread-safe)."""
    global _service
    if _service is None:
        with _lock:
            if _service is None:
                _service = SpellingService()
    return _service


async def load_spelling_service():
    """Load the spelling service."""
    service = get_spelling_service()
    if not service.primary_ready and not service.fallback_ready:
        await service.load()
