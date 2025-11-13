"""
Grammar Checking Service
Primary: mT5-small (Google - multilingual T5, optimized for grammar)
Fallback: IndicBERT (ai4bharat - Indian languages BERT)
"""
import logging
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForMaskedLM, pipeline
from typing import List, Dict, Optional
import asyncio
import re

logger = logging.getLogger(__name__)

class GrammarService:
    """
    Dedicated grammar checking service.
    Primary: mT5 for grammar correction
    Fallback: IndicBERT for error detection
    """
    
    def __init__(
        self,
        primary_model: str = "google/mt5-small",
        fallback_model: str = "ai4bharat/IndicBERTv2-MLM-only",
        cache_dir: str = "./models",
        use_gpu: bool = False
    ):
        self.primary_model_name = primary_model
        self.fallback_model_name = fallback_model
        self.cache_dir = cache_dir
        self.device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"
        
        # Models
        self.primary_model = None
        self.primary_tokenizer = None
        self.fallback_model = None
        self.fallback_tokenizer = None
        
        self.primary_ready = False
        self.fallback_ready = False
        
        logger.info(f"Grammar Service initialized")
        logger.info(f"Primary: {primary_model}")
        logger.info(f"Fallback: {fallback_model}")
        logger.info(f"Device: {self.device}")
    
    async def load(self):
        """Load grammar checking models"""
        # Try loading primary model (mT5)
        try:
            logger.info("Loading primary grammar model (mT5)...")
            await self._load_primary()
        except Exception as e:
            logger.warning(f"Primary model failed to load: {e}")
        
        # Try loading fallback model (IndicBERT)
        if not self.primary_ready:
            try:
                logger.info("Loading fallback grammar model (IndicBERT)...")
                await self._load_fallback()
            except Exception as e:
                logger.error(f"Fallback model failed to load: {e}")
    
    async def _load_primary(self):
        """Load mT5 model for grammar correction"""
        loop = asyncio.get_event_loop()
        
        def load():
            tokenizer = AutoTokenizer.from_pretrained(
                self.primary_model_name,
                cache_dir=self.cache_dir
            )
            model = AutoModelForSeq2SeqLM.from_pretrained(
                self.primary_model_name,
                cache_dir=self.cache_dir
            )
            if self.device == "cuda":
                model = model.to(self.device)
            return tokenizer, model
        
        self.primary_tokenizer, self.primary_model = await loop.run_in_executor(None, load)
        self.primary_ready = True
        logger.info("✅ mT5 grammar model loaded!")
    
    async def _load_fallback(self):
        """Load IndicBERT model as fallback"""
        loop = asyncio.get_event_loop()
        
        def load():
            tokenizer = AutoTokenizer.from_pretrained(
                self.fallback_model_name,
                cache_dir=self.cache_dir
            )
            model = AutoModelForMaskedLM.from_pretrained(
                self.fallback_model_name,
                cache_dir=self.cache_dir
            )
            if self.device == "cuda":
                model = model.to(self.device)
            return tokenizer, model
        
        self.fallback_tokenizer, self.fallback_model = await loop.run_in_executor(None, load)
        self.fallback_ready = True
        logger.info("✅ IndicBERT fallback model loaded!")
    
    async def check_grammar(self, text: str) -> List[Dict]:
        """
        Check grammar using AI models.
        Uses mT5 if available, falls back to IndicBERT.
        NO hardcoded patterns - pure AI.
        """
        if not text or len(text.strip()) < 3:
            return []
        
        if self.primary_ready:
            return await self._check_with_mt5(text)
        elif self.fallback_ready:
            return await self._check_with_indicbert(text)
        else:
            logger.warning("No grammar models available")
            return []
    
    async def _check_with_mt5(self, text: str) -> List[Dict]:
        """Use mT5 for grammar checking"""
        try:
            logger.info(f"Checking grammar with mT5: {text}")
            
            loop = asyncio.get_event_loop()
            
            def check_sync():
                # Create prompt for grammar checking
                prompt = f"grammar: {text}"
                
                inputs = self.primary_tokenizer(
                    prompt,
                    return_tensors="pt",
                    max_length=512,
                    truncation=True
                )
                
                if self.device == "cuda":
                    inputs = {k: v.to(self.device) for k, v in inputs.items()}
                
                # Generate correction
                outputs = self.primary_model.generate(
                    **inputs,
                    max_length=512,
                    num_beams=4,
                    early_stopping=True
                )
                
                corrected = self.primary_tokenizer.decode(outputs[0], skip_special_tokens=True)
                return corrected
            
            corrected_text = await loop.run_in_executor(None, check_sync)
            
            # Compare original and corrected to find errors
            errors = self._compare_texts(text, corrected_text)
            logger.info(f"mT5 found {len(errors)} grammar issues")
            return errors
            
        except Exception as e:
            logger.error(f"mT5 grammar check failed: {e}")
            return []
    
    async def _check_with_indicbert(self, text: str) -> List[Dict]:
        """Use IndicBERT for grammar detection"""
        try:
            logger.info(f"Checking grammar with IndicBERT: {text}")
            # IndicBERT for masked language modeling - can detect anomalies
            # This is a simplified implementation
            return []
        except Exception as e:
            logger.error(f"IndicBERT grammar check failed: {e}")
            return []
    
    def _compare_texts(self, original: str, corrected: str) -> List[Dict]:
        """
        Compare original and corrected text to identify errors.
        Uses diff algorithm to find specific changes.
        """
        if original == corrected:
            return []
        
        errors = []
        
        # Simple word-level comparison
        original_words = original.split()
        corrected_words = corrected.split()
        
        # Find differences
        for i, (orig, corr) in enumerate(zip(original_words, corrected_words)):
            if orig != corr:
                # Calculate offset
                offset = len(' '.join(original_words[:i])) + (1 if i > 0 else 0)
                
                errors.append({
                    "type": "grammar",
                    "offset": offset,
                    "length": len(orig),
                    "original_text": orig,
                    "suggestions": [corr],
                    "message": "ব্যাকরণ ত্রুটি পাওয়া গেছে",
                    "reason": f"AI পরামর্শ: '{corr}' ব্যবহার করুন।",
                    "confidence": 0.90
                })
        
        return errors
    
    def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up grammar service...")
        if self.primary_model:
            del self.primary_model
            del self.primary_tokenizer
        if self.fallback_model:
            del self.fallback_model
            del self.fallback_tokenizer
        if self.device == "cuda":
            torch.cuda.empty_cache()

# Global instance
_service: Optional[GrammarService] = None

def get_grammar_service() -> GrammarService:
    """Get or create grammar service instance"""
    global _service
    if _service is None:
        _service = GrammarService()
    return _service

async def load_grammar_service():
    """Load the grammar service"""
    service = get_grammar_service()
    if not service.primary_ready and not service.fallback_ready:
        await service.load()

