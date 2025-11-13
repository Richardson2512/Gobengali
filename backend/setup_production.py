#!/usr/bin/env python3
"""
Production Setup Script for GoBengali
Installs and configures all AI models with fallbacks
NO mock data - fully functional AI backend
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")

def check_requirements():
    """Check if core packages are installed"""
    print_header("🔍 Checking Dependencies")
    
    required = {
        'transformers': 'Hugging Face Transformers',
        'torch': 'PyTorch',
        'sentencepiece': 'SentencePiece (for NLLB)',
        'language_tool_python': 'LanguageTool (spelling fallback)',
        'langdetect': 'Language Detection'
    }
    
    missing = []
    for package, name in required.items():
        try:
            __import__(package)
            print(f"✓ {name}")
        except ImportError:
            print(f"✗ {name} - MISSING")
            missing.append(package)
    
    # Check BSpell separately
    try:
        import bspell
        print("✓ BSpell (Primary spelling checker)")
    except ImportError:
        print("⚠️  BSpell - NOT INSTALLED (will use LanguageTool fallback)")
        print("   Install: pip install git+https://github.com/sagorbrur/bspell.git")
    
    if missing:
        print(f"\n❌ Missing packages: {', '.join(missing)}")
        print("\n💡 Install with:")
        print("   pip install -r requirements-production.txt")
        return False
    
    print("\n✅ All core dependencies installed!")
    return True

def install_bspell():
    """Install BSpell from GitHub"""
    print_header("📥 Installing BSpell")
    
    try:
        import bspell
        print("✓ BSpell already installed")
        return True
    except ImportError:
        print("Installing BSpell from GitHub...")
        try:
            subprocess.run([
                sys.executable, "-m", "pip", "install",
                "git+https://github.com/sagorbrur/bspell.git"
            ], check=True)
            print("✅ BSpell installed successfully!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"⚠️  BSpell installation failed: {e}")
            print("   Will use LanguageTool as fallback")
            return False

def download_models():
    """Download all AI models"""
    print_header("📥 Downloading AI Models (3GB total, ~15 minutes)")
    
    try:
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
                "type": "seq2seq",
                "critical": True
            },
            {
                "name": "Grammar Primary (mT5)",
                "id": "google/mt5-small",
                "size": "1.2GB",
                "type": "t5",
                "critical": False
            },
            {
                "name": "Grammar Fallback (IndicBERT)",
                "id": "ai4bharat/IndicBERTv2-MLM-only",
                "size": "560MB",
                "type": "mlm",
                "critical": False
            }
        ]
        
        cache_dir = "./models"
        os.makedirs(cache_dir, exist_ok=True)
        
        success_count = 0
        for model_info in models:
            print(f"\n📦 [{models.index(model_info) + 1}/{len(models)}] {model_info['name']}")
            print(f"   Size: {model_info['size']} | ID: {model_info['id']}")
            
            try:
                print("   ⏳ Downloading tokenizer...")
                tokenizer = AutoTokenizer.from_pretrained(
                    model_info['id'],
                    cache_dir=cache_dir
                )
                print("   ✓ Tokenizer OK")
                
                print("   ⏳ Downloading model...")
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
                
                print(f"   ✅ {model_info['name']} ready!")
                success_count += 1
                
                # Clean up to save memory
                del model
                del tokenizer
                
            except Exception as e:
                print(f"   ❌ Failed: {e}")
                if model_info['critical']:
                    print(f"   ⚠️  {model_info['name']} is CRITICAL!")
                    return False
                else:
                    print(f"   ℹ️  {model_info['name']} is optional (has fallback)")
        
        print(f"\n✅ Successfully downloaded {success_count}/{len(models)} models")
        print(f"📁 Models cached in: {os.path.abspath(cache_dir)}")
        return success_count > 0
        
    except Exception as e:
        print(f"❌ Model download failed: {e}")
        return False

def setup_languagetool():
    """Setup LanguageTool"""
    print_header("🔧 Setting up LanguageTool")
    
    try:
        import language_tool_python
        
        print("Downloading LanguageTool data...")
        # Initialize for Bengali - this downloads necessary files
        tool = language_tool_python.LanguageTool('bn')
        tool.close()
        
        print("✅ LanguageTool ready for Bengali")
        return True
    except Exception as e:
        print(f"⚠️  LanguageTool setup failed: {e}")
        print("   Spelling fallback may not work properly")
        return False

def create_config():
    """Create production configuration"""
    print_header("⚙️  Creating Production Config")
    
    env_file = ".env"
    
    if os.path.exists(env_file):
        response = input(f"⚠️  {env_file} already exists. Overwrite? [y/N]: ")
        if response.lower() not in ['y', 'yes']:
            print("   Keeping existing configuration")
            return True
    
    config = """# GoBengali Production Configuration
# Full AI models with intelligent fallbacks

# Model Settings
USE_GPU=false
MODEL_CACHE_DIR=./models
MODEL_TIMEOUT=5.0

# Primary Models
TRANSLATION_MODEL=facebook/nllb-200-distilled-600M
GRAMMAR_MODEL=google/mt5-small

# Fallback Models  
GRAMMAR_FALLBACK=ai4bharat/IndicBERTv2-MLM-only

# API Settings
DEBUG=true
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Performance
MAX_LENGTH=512
BATCH_SIZE=8

# For GPU (if available):
# USE_GPU=true
# Install: pip install torch==2.1.0+cu118

# For production:
# DEBUG=false
# MODEL_TIMEOUT=10.0
"""
    
    try:
        with open(env_file, 'w') as f:
            f.write(config)
        print(f"✅ Configuration created: {env_file}")
        return True
    except Exception as e:
        print(f"❌ Failed to create config: {e}")
        return False

def verify_setup():
    """Verify the setup"""
    print_header("🔍 Verifying Setup")
    
    try:
        print("Importing production model manager...")
        from models.production_model_manager import ProductionModelManager
        print("✓ Production model manager imported")
        
        print("\nChecking model files...")
        cache_dir = Path("./models")
        if cache_dir.exists():
            model_files = list(cache_dir.rglob("*.bin")) + list(cache_dir.rglob("*.safetensors"))
            print(f"✓ Found {len(model_files)} model files")
        else:
            print("⚠️  Model cache directory not found")
        
        print("\n✅ Setup verification complete!")
        return True
        
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False

def print_next_steps():
    """Print next steps"""
    print_header("🎯 Next Steps")
    
    print("""
1. Update main.py to use ProductionModelManager:
   
   # Change this line:
   from models.model_manager import ModelManager
   
   # To this:
   from models.production_model_manager import ProductionModelManager as ModelManager

2. Start the server:
   
   python main.py
   
   or
   
   python main_simple.py

3. Test the API:
   
   curl http://localhost:8000/health
   
   curl -X POST http://localhost:8000/analyze \\
     -H "Content-Type: application/json" \\
     -d '{"text": "Hello world", "check_grammar": true, "check_spelling": true}'

4. Monitor performance:
   
   GET http://localhost:8000/metrics

📊 Model Overview:
==================
PRIMARY:
- Translation: NLLB-200 (1.2GB)
- Grammar: mT5 (1.2GB)  
- Spelling: BSpell (10MB)

FALLBACK (if primary fails/slow):
- Grammar: IndicBERT (560MB)
- Spelling: LanguageTool (200MB)

🎯 NO hardcoded data - everything is AI-powered!
""")

def main():
    """Main setup function"""
    print("\n" + "=" * 70)
    print("  🤖 GoBengali Production Setup")
    print("  Full AI Backend with Intelligent Fallbacks")
    print("=" * 70)
    
    # Step 1: Check dependencies
    if not check_requirements():
        print("\n❌ Please install missing dependencies first")
        sys.exit(1)
    
    # Step 2: Install BSpell
    input("\nPress Enter to install BSpell (primary spelling checker)...")
    install_bspell()
    
    # Step 3: Setup LanguageTool
    input("\nPress Enter to setup LanguageTool (spelling fallback)...")
    setup_languagetool()
    
    # Step 4: Download models
    print("\n" + "=" * 70)
    print("⚠️  Model Download: 3GB total, takes ~15 minutes")
    print("=" * 70)
    response = input("\nDownload AI models now? [Y/n]: ")
    
    if response.lower() not in ['n', 'no']:
        if not download_models():
            print("\n❌ Model download failed")
            sys.exit(1)
    else:
        print("\n⏭️  Skipping model download")
        print("   Models will be downloaded on first API call")
    
    # Step 5: Create config
    input("\nPress Enter to create configuration...")
    create_config()
    
    # Step 6: Verify
    input("\nPress Enter to verify setup...")
    verify_setup()
    
    # Done
    print_next_steps()
    
    print("\n" + "=" * 70)
    print("  ✅ Production Setup Complete!")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    main()

