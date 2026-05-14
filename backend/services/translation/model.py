"""
Translation Service using IndicTrans2
Model: ai4bharat/indictrans2-en-indic-dist-200M
"""
import asyncio
import logging
import threading
from typing import Optional

import torch

logger = logging.getLogger(__name__)


class TranslationService:
    """
    Translation service using IndicTrans2 (ai4bharat/indictrans2-en-indic-dist-200M).
    Lazy-loads on first request.
    """

    def __init__(
        self,
        model_name: str = "ai4bharat/indictrans2-en-indic-dist-200M",
        cache_dir: str = "./models",
        use_gpu: bool = False,
    ):
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"

        self.model = None
        self.tokenizer = None
        self.processor = None
        self.ready = False
        self._loading = False
        self._load_lock = threading.Lock()

        logger.info(f"Translation Service initialized (lazy) with {model_name}")

    def _load_sync(self):
        """Synchronous model load — runs in executor."""
        from IndicTransToolkit import IndicProcessor, IndicTransTokenizer
        from transformers import AutoModelForSeq2SeqLM

        tokenizer = IndicTransTokenizer(direction="en-indic")
        processor = IndicProcessor(inference=True)
        model = AutoModelForSeq2SeqLM.from_pretrained(
            self.model_name,
            trust_remote_code=True,
            cache_dir=self.cache_dir,
        )
        if self.device == "cuda":
            model = model.to(self.device)
        model.eval()
        return tokenizer, processor, model

    async def _ensure_loaded(self):
        """Load model on first use."""
        if self.ready:
            return

        should_load = False
        with self._load_lock:
            if not self.ready and not self._loading:
                self._loading = True
                should_load = True

        if should_load:
            logger.info("Loading IndicTrans2 model on first request...")
            loop = asyncio.get_running_loop()
            try:
                self.tokenizer, self.processor, self.model = await loop.run_in_executor(
                    None, self._load_sync
                )
                self.ready = True
                logger.info("IndicTrans2 model loaded successfully.")
            except Exception as e:
                self._loading = False
                logger.error(f"Failed to load IndicTrans2 model: {e}", exc_info=True)
                raise
        else:
            # Another coroutine is loading — wait for it
            while self._loading and not self.ready:
                await asyncio.sleep(0.2)

    async def load(self):
        """Explicit pre-load (optional)."""
        await self._ensure_loaded()

    async def translate(
        self,
        text: str,
        source_lang: str = "eng_Latn",
        target_lang: str = "ben_Beng",
    ) -> Optional[str]:
        if not text.strip():
            return text

        if source_lang == target_lang:
            return text

        try:
            await self._ensure_loaded()
        except Exception:
            return None

        try:
            loop = asyncio.get_running_loop()

            def translate_sync():
                import nltk
                try:
                    sentences = nltk.sent_tokenize(text)
                except LookupError:
                    nltk.download("punkt", quiet=True)
                    nltk.download("punkt_tab", quiet=True)
                    sentences = nltk.sent_tokenize(text)

                batch = self.processor.preprocess_batch(
                    sentences, src_lang=source_lang, tgt_lang=target_lang
                )

                inputs = self.tokenizer(
                    batch,
                    src=True,
                    truncation=True,
                    padding="longest",
                    return_tensors="pt",
                )

                if self.device == "cuda":
                    inputs = {k: v.to(self.device) for k, v in inputs.items()}

                with torch.no_grad():
                    generated = self.model.generate(
                        **inputs,
                        num_beams=5,
                        max_length=256,
                    )

                decoded = self.tokenizer.batch_decode(generated, src=False)
                translations = self.processor.postprocess_batch(decoded, lang=target_lang)
                return " ".join(translations)

            result = await loop.run_in_executor(None, translate_sync)
            logger.info(f"Translated ({source_lang}->{target_lang}): {text[:60]!r}")
            return result

        except Exception as e:
            logger.error(f"Translation failed: {e}", exc_info=True)
            return None

    def cleanup(self):
        if self.model:
            del self.model
            del self.tokenizer
            del self.processor
        if self.device == "cuda":
            torch.cuda.empty_cache()
        self.ready = False


# Thread-safe singleton
_service: Optional[TranslationService] = None
_lock = threading.Lock()


def get_translation_service() -> TranslationService:
    global _service
    if _service is None:
        with _lock:
            if _service is None:
                from config import settings
                _service = TranslationService(
                    model_name=settings.TRANSLATION_MODEL or "ai4bharat/indictrans2-en-indic-dist-200M",
                    cache_dir=settings.MODEL_CACHE_DIR,
                    use_gpu=settings.USE_GPU,
                )
    return _service


async def load_translation_service():
    service = get_translation_service()
    if not service.ready:
        await service.load()
