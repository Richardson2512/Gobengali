"""
Translation Service using NLLB-200
Primary Model: facebook/nllb-200-distilled-1.3B (Best multilingual translation)
"""
import logging
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Optional
import asyncio

logger = logging.getLogger(__name__)

class TranslationService:
    """
    Dedicated translation service using NLLB-200.
    Loads independently to prevent crashes affecting other services.
    """
    
    def __init__(
        self,
        model_name: str = "facebook/nllb-200-distilled-1.3B",
        cache_dir: str = "./models",
        use_gpu: bool = False
    ):
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"
        
        self.model = None
        self.tokenizer = None
        self.ready = False
        
        logger.info(f"Translation Service initialized with {model_name}")
        logger.info(f"Device: {self.device}")
    
    async def load(self):
        """Load NLLB-200 model asynchronously"""
        try:
            logger.info("Loading NLLB-200 translation model...")
            
            loop = asyncio.get_event_loop()
            
            def load_model():
                tokenizer = AutoTokenizer.from_pretrained(
                    self.model_name,
                    cache_dir=self.cache_dir
                )
                model = AutoModelForSeq2SeqLM.from_pretrained(
                    self.model_name,
                    cache_dir=self.cache_dir
                )
                if self.device == "cuda":
                    model = model.to(self.device)
                return tokenizer, model
            
            self.tokenizer, self.model = await loop.run_in_executor(None, load_model)
            self.ready = True
            
            logger.info("✅ NLLB-200 translation model loaded successfully!")
            
        except Exception as e:
            logger.error(f"Failed to load translation model: {e}", exc_info=True)
            self.ready = False
    
    async def translate(
        self,
        text: str,
        source_lang: str = "eng_Latn",
        target_lang: str = "ben_Beng"
    ) -> Optional[str]:
        """
        Translate text using NLLB-200 model.
        
        Args:
            text: Text to translate
            source_lang: Source language code (NLLB format)
            target_lang: Target language code (NLLB format)
            
        Returns:
            Translated text or None if translation fails
        """
        if not self.ready:
            logger.error("Translation service not ready")
            return None
        
        if source_lang == target_lang:
            return text
        
        try:
            loop = asyncio.get_event_loop()
            
            def translate_sync():
                # Set source language
                self.tokenizer.src_lang = source_lang
                
                # Tokenize
                inputs = self.tokenizer(
                    text,
                    return_tensors="pt",
                    padding=True,
                    truncation=True,
                    max_length=512
                )
                
                if self.device == "cuda":
                    inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                # Get target language token ID
                try:
                    forced_bos_token_id = self.tokenizer.convert_tokens_to_ids(target_lang)
                except:
                    # Fallback mapping for common languages
                    lang_id_map = {
                        "ben_Beng": 256171,  # Bengali
                        "eng_Latn": 256047,  # English
                        "hin_Deva": 256131   # Hindi
                    }
                    forced_bos_token_id = lang_id_map.get(target_lang, 256171)
                
                # Generate translation
                translated_tokens = self.model.generate(
                    **inputs,
                    forced_bos_token_id=forced_bos_token_id,
                    max_length=512,
                    num_beams=5,
                    early_stopping=True
                )
                
                # Decode
                translated_text = self.tokenizer.batch_decode(
                    translated_tokens,
                    skip_special_tokens=True
                )[0]
                
                return translated_text
            
            result = await loop.run_in_executor(None, translate_sync)
            logger.info(f"Translation: '{text}' -> '{result}'")
            return result
            
        except Exception as e:
            logger.error(f"Translation failed: {e}", exc_info=True)
            return None
    
    def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up translation service...")
        if self.model:
            del self.model
            del self.tokenizer
        if self.device == "cuda":
            torch.cuda.empty_cache()
        self.ready = False

# Global instance
_service: Optional[TranslationService] = None

def get_translation_service() -> TranslationService:
    """Get or create translation service instance"""
    global _service
    if _service is None:
        _service = TranslationService()
    return _service

async def load_translation_service():
    """Load the translation service"""
    service = get_translation_service()
    if not service.ready:
        await service.load()

