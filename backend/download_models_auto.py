"""
Automatic Model Download - No prompts, just downloads
"""

import os
import sys

print("\n" + "=" * 70)
print("  GoBengali AI Model Download (Automatic)")
print("=" * 70)
print("\nDownloading 3GB of AI models...")
print("This will take 10-15 minutes\n")

print("Checking dependencies...")
try:
    import transformers
    import torch
    print("OK - transformers and torch installed\n")
except ImportError as e:
    print(f"ERROR: {e}")
    print("Install with: pip install transformers torch")
    sys.exit(1)

print("Creating models directory...")
cache_dir = "./models"
os.makedirs(cache_dir, exist_ok=True)
print(f"OK - {os.path.abspath(cache_dir)}\n")

print("=" * 70)
print("Downloading models...")
print("=" * 70)

from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    AutoModelForMaskedLM,
    T5ForConditionalGeneration
)

models = [
    ("Translation NLLB-200", "facebook/nllb-200-distilled-600M", "seq2seq", "1.2GB"),
    ("Grammar mT5", "google/mt5-small", "t5", "1.2GB"),
    ("Grammar IndicBERT", "ai4bharat/IndicBERTv2-MLM-only", "mlm", "560MB")
]

success = 0
for idx, (name, model_id, model_type, size) in enumerate(models, 1):
    print(f"\n[{idx}/{len(models)}] {name} ({size})")
    print(f"Model: {model_id}")
    
    try:
        print("  Downloading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(model_id, cache_dir=cache_dir)
        print("  OK - Tokenizer")
        
        print("  Downloading model (this takes time)...")
        if model_type == 'seq2seq':
            model = AutoModelForSeq2SeqLM.from_pretrained(model_id, cache_dir=cache_dir)
        elif model_type == 't5':
            model = T5ForConditionalGeneration.from_pretrained(model_id, cache_dir=cache_dir)
        else:
            model = AutoModelForMaskedLM.from_pretrained(model_id, cache_dir=cache_dir)
        
        print(f"  OK - {name} ready!")
        success += 1
        
        del model, tokenizer
        
    except Exception as e:
        print(f"  ERROR: {e}")

print("\n" + "=" * 70)
print(f"Complete: {success}/{len(models)} models downloaded")
print("=" * 70)

if success > 0:
    print("\nSUCCESS! Models are ready.")
    print(f"Location: {os.path.abspath(cache_dir)}")
    print("\nNext: python main_production_lite.py")
else:
    print("\nFAILED - No models downloaded")
    print("Check internet and try again")

