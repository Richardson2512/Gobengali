#!/usr/bin/env python3
"""
Quick setup script to download and configure AI models for GoBengali
Run with: python setup_ai_models.py
"""

import os
import sys
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    print("🔍 Checking requirements...")
    required_packages = [
        'transformers',
        'torch',
        'sentencepiece',
        'symspellpy',
        'langdetect'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✓ {package}")
        except ImportError:
            print(f"  ✗ {package} (missing)")
            missing.append(package)
    
    if missing:
        print(f"\n❌ Missing packages: {', '.join(missing)}")
        print(f"\n💡 Install with: pip install -r requirements-ai-models.txt")
        return False
    
    print("✅ All requirements satisfied!\n")
    return True

def download_models():
    """Download AI models"""
    print("📥 Downloading AI models (this will take 5-15 minutes)...\n")
    
    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForMaskedLM
        
        models = [
            {
                "name": "Translation (NLLB-200)",
                "id": "facebook/nllb-200-distilled-600M",
                "size": "1.2GB",
                "type": "seq2seq"
            },
            {
                "name": "Grammar (IndicBERT)",
                "id": "ai4bharat/IndicBERTv2-MLM-only",
                "size": "560MB",
                "type": "mlm"
            }
        ]
        
        cache_dir = "./models"
        os.makedirs(cache_dir, exist_ok=True)
        
        for model_info in models:
            print(f"\n📦 Downloading {model_info['name']} ({model_info['size']})...")
            print(f"   Model ID: {model_info['id']}")
            
            try:
                # Download tokenizer
                print("   ⏳ Downloading tokenizer...")
                tokenizer = AutoTokenizer.from_pretrained(
                    model_info['id'],
                    cache_dir=cache_dir
                )
                print("   ✓ Tokenizer downloaded")
                
                # Download model
                print("   ⏳ Downloading model...")
                if model_info['type'] == 'seq2seq':
                    model = AutoModelForSeq2SeqLM.from_pretrained(
                        model_info['id'],
                        cache_dir=cache_dir
                    )
                else:
                    model = AutoModelForMaskedLM.from_pretrained(
                        model_info['id'],
                        cache_dir=cache_dir
                    )
                print(f"   ✓ {model_info['name']} downloaded successfully!")
                
                del model
                del tokenizer
                
            except Exception as e:
                print(f"   ❌ Failed to download {model_info['name']}: {e}")
                return False
        
        print("\n✅ All models downloaded successfully!")
        print(f"📁 Models cached in: {os.path.abspath(cache_dir)}")
        return True
        
    except ImportError as e:
        print(f"❌ Error importing transformers: {e}")
        print("💡 Install with: pip install transformers torch")
        return False

def create_bengali_dictionary():
    """Create a basic Bengali dictionary for spell checking"""
    print("\n📝 Creating Bengali dictionary...")
    
    dict_file = "bengali_dictionary.txt"
    
    if os.path.exists(dict_file):
        print(f"  ℹ️  Dictionary already exists: {dict_file}")
        return True
    
    # Basic Bengali word frequency list
    words = """আমি 10000
তুমি 8000
সে 8000
আমরা 7000
তোমরা 6000
তারা 6000
এই 9000
সেই 7000
কি 9000
কে 8000
কোথায় 6000
কখন 6000
কেন 7000
কিভাবে 6000
আছে 9000
ছিল 8000
হবে 8000
করছে 7000
করেছে 7000
করবে 7000
বলছে 6000
বলেছে 6000
যাচ্ছে 6000
যাবে 6000
আসছে 6000
আসবে 6000
দেখছে 6000
দেখেছে 6000
ভালো 8000
খারাপ 6000
বড় 7000
ছোট 6000
নতুন 7000
পুরাতন 5000
সুন্দর 7000
বই 7000
কলম 6000
কাগজ 6000
টেবিল 5000
চেয়ার 5000
ঘর 7000
দরজা 6000
জানালা 5000
মানুষ 8000
ছেলে 7000
মেয়ে 7000
বাবা 7000
মা 8000
ভাই 7000
বোন 7000
বন্ধু 7000
স্কুল 7000
কলেজ 6000
বিশ্ববিদ্যালয় 6000
শিক্ষক 6000
ছাত্র 7000
পরীক্ষা 7000
বাংলা 9000
ইংরেজি 7000
গণিত 6000
বিজ্ঞান 6000
ঢাকা 8000
কলকাতা 7000
ভারত 8000
বাংলাদেশ 9000
তিনশ 5000
সরকার 7000
ছিলো 6000
করছেন 6000
বলছেন 5000"""
    
    try:
        with open(dict_file, 'w', encoding='utf-8') as f:
            f.write(words)
        print(f"  ✓ Dictionary created: {dict_file}")
        print(f"  📊 Contains {len(words.split(chr(10)))} words")
        return True
    except Exception as e:
        print(f"  ❌ Failed to create dictionary: {e}")
        return False

def create_env_file():
    """Create .env file with model configuration"""
    print("\n⚙️  Creating .env configuration...")
    
    env_file = ".env"
    
    if os.path.exists(env_file):
        print(f"  ℹ️  .env file already exists")
        return True
    
    env_content = """# GoBengali AI Model Configuration

# Model Settings
USE_GPU=false
MODEL_CACHE_DIR=./models

# AI Models
TRANSLATION_MODEL=facebook/nllb-200-distilled-600M
GRAMMAR_MODEL=ai4bharat/IndicBERTv2-MLM-only

# Set USE_GPU=true if you have NVIDIA GPU with CUDA
# For larger models (better accuracy but slower):
# TRANSLATION_MODEL=facebook/nllb-200-distilled-1.3B

# API Settings
DEBUG=true
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
"""
    
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
        print(f"  ✓ Configuration created: {env_file}")
        return True
    except Exception as e:
        print(f"  ❌ Failed to create .env: {e}")
        return False

def main():
    """Main setup function"""
    print("=" * 60)
    print("🤖 GoBengali AI Models Setup")
    print("=" * 60)
    print()
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Create configuration
    create_env_file()
    
    # Create dictionary
    create_bengali_dictionary()
    
    # Download models
    print("\n" + "=" * 60)
    response = input("📥 Download AI models now? (2-3GB, ~10 minutes) [y/N]: ")
    
    if response.lower() in ['y', 'yes']:
        if download_models():
            print("\n" + "=" * 60)
            print("✅ Setup Complete!")
            print("=" * 60)
            print("\n🚀 Next steps:")
            print("   1. Run: python main.py")
            print("   2. API will be available at: http://localhost:8000")
            print("   3. Test with: http://localhost:8000/health")
            print()
        else:
            print("\n❌ Model download failed")
            sys.exit(1)
    else:
        print("\n⏭️  Skipping model download")
        print("💡 Models will be downloaded automatically on first API call")
        print("🚀 You can now run: python main.py")
        print()

if __name__ == "__main__":
    main()

