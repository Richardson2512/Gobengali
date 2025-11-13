"""
Simple Model Download Script - No emojis, just downloads
"""

import os
import sys

print("\n" + "=" * 70)
print("  GoBengali AI Model Download")
print("=" * 70)
print("\nThis will download approximately 3GB of AI models")
print("Download takes 10-15 minutes depending on your internet speed")
print("Models are cached and only need to be downloaded once\n")

response = input("Continue? (Y/n): ")
if response.lower() == 'n':
    print("Cancelled")
    sys.exit(0)

print("\nChecking dependencies...")
try:
    import transformers
    import torch
    print("OK - transformers and torch installed")
except ImportError as e:
    print(f"ERROR: {e}")
    print("Install with: pip install transformers torch")
    sys.exit(1)

print("\nCreating models cache directory...")
cache_dir = "./models"
os.makedirs(cache_dir, exist_ok=True)
print(f"OK - Cache directory: {os.path.abspath(cache_dir)}")

print("\n" + "=" * 70)
print("Starting model downloads...")
print("=" * 70)

from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    AutoModelForMaskedLM,
    T5ForConditionalGeneration
)

models = [
    {
        "name": "Translation (NLLB-200)",
        "id": "facebook/nllb-200-distilled-600M",
        "size": "1.2GB",
        "type": "seq2seq"
    },
    {
        "name": "Grammar Primary (mT5)",
        "id": "google/mt5-small",
        "size": "1.2GB",
        "type": "t5"
    },
    {
        "name": "Grammar Fallback (IndicBERT)",
        "id": "ai4bharat/IndicBERTv2-MLM-only",
        "size": "560MB",
        "type": "mlm"
    }
]

success_count = 0
for idx, model_info in enumerate(models, 1):
    print(f"\n[{idx}/{len(models)}] Downloading {model_info['name']}")
    print(f"    Model ID: {model_info['id']}")
    print(f"    Size: {model_info['size']}")
    print(f"    This may take 5-10 minutes...\n")
    
    try:
        print("    Downloading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(
            model_info['id'],
            cache_dir=cache_dir
        )
        print("    OK - Tokenizer downloaded")
        
        print("    Downloading model...")
        if model_info['type'] == 'seq2seq':
            model = AutoModelForSeq2SeqLM.from_pretrained(
                model_info['id'],
                cache_dir=cache_dir
            )
        elif model_info['type'] == 't5':
            model = T5ForConditionalGeneration.from_pretrained(
                model_info['id'],
                cache_dir=cache_dir
            )
        else:  # mlm
            model = AutoModelForMaskedLM.from_pretrained(
                model_info['id'],
                cache_dir=cache_dir
            )
        
        print(f"    OK - {model_info['name']} downloaded successfully!")
        success_count += 1
        
        # Clean up
        del model
        del tokenizer
        
    except Exception as e:
        print(f"    ERROR: {e}")
        print(f"    Skipping {model_info['name']}")

print("\n" + "=" * 70)
print(f"  Download Complete: {success_count}/{len(models)} models")
print("=" * 70)

if success_count > 0:
    print("\nOK - Models are ready!")
    print(f"Cached in: {os.path.abspath(cache_dir)}")
    print("\nNext step: python main_production_lite.py")
else:
    print("\nERROR - No models were downloaded")
    print("Check your internet connection and try again")

