"""
Grammar Checking Service

Uses Google Gemini Flash API for Bengali grammar correction.
Falls back to no-op if GEMINI_API_KEY is not set.
"""
import logging
import os
import threading
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class GrammarService:
    def __init__(self):
        self.gemini_client = None
        self.ready = False
        logger.info("Grammar Service initialized (Gemini Flash)")

    async def load(self):
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            logger.warning("GEMINI_API_KEY not set — grammar service disabled")
            return
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self.gemini_client = genai.GenerativeModel("gemini-1.5-flash")
            self.ready = True
            logger.info("Gemini Flash grammar model ready")
        except Exception as e:
            logger.error(f"Failed to initialise Gemini client: {e}")

    async def check_grammar(self, text: str) -> List[Dict]:
        if not text or len(text.strip()) < 3:
            return []
        if not self.ready or self.gemini_client is None:
            logger.warning("Grammar service not ready")
            return []
        try:
            prompt = (
                "You are a Bengali grammar correction assistant. "
                "Correct any grammar errors in the following Bengali text and return ONLY the corrected text, "
                "nothing else. If the text is already correct, return it unchanged.\n\n"
                f"Text: {text}"
            )
            response = self.gemini_client.generate_content(prompt)
            corrected = response.text.strip()
            return self._compare_texts(text, corrected)
        except Exception as e:
            logger.error(f"Gemini grammar check failed: {e}")
            return []

    def _compare_texts(self, original: str, corrected: str) -> List[Dict]:
        if original == corrected or not corrected:
            return []

        errors = []
        original_words = original.split()
        corrected_words = corrected.split()

        for i, (orig, corr) in enumerate(zip(original_words, corrected_words)):
            if orig != corr:
                offset = len(" ".join(original_words[:i])) + (1 if i > 0 else 0)
                errors.append(
                    {
                        "type": "grammar",
                        "offset": offset,
                        "length": len(orig),
                        "original_text": orig,
                        "suggestions": [corr],
                        "message": "ব্যাকরণ ত্রুটি পাওয়া গেছে",
                        "reason": f"AI পরামর্শ: '{corr}' ব্যবহার করুন।",
                        "confidence": 0.85,
                    }
                )

        return errors

    def cleanup(self):
        logger.info("Cleaning up grammar service...")
        self.gemini_client = None
        self.ready = False


# Thread-safe singleton
_service: Optional[GrammarService] = None
_lock = threading.Lock()


def get_grammar_service() -> GrammarService:
    global _service
    if _service is None:
        with _lock:
            if _service is None:
                _service = GrammarService()
    return _service


async def load_grammar_service():
    service = get_grammar_service()
    if not service.ready:
        await service.load()
