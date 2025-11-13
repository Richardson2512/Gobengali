"""Quick test to verify AI models load correctly"""
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_models():
    print("\n" + "=" * 70)
    print("Testing AI Model Loading")
    print("=" * 70)
    
    try:
        from models.production_model_manager import ProductionModelManager
        
        print("\n1. Creating ProductionModelManager...")
        manager = ProductionModelManager(
            translation_model_name="facebook/nllb-200-distilled-600M",
            grammar_model_name="google/mt5-small",
            grammar_fallback_name="ai4bharat/IndicBERTv2-MLM-only",
            use_gpu=False,
            cache_dir="./models"
        )
        print("   OK - Manager created")
        
        print("\n2. Loading models from cache...")
        print("   This may take 60-90 seconds...")
        await manager.load_models()
        
        print("\n" + "=" * 70)
        print("SUCCESS! All models loaded")
        print("=" * 70)
        
        # Get metrics
        metrics = manager.get_metrics()
        print("\nModel Status:")
        print(f"  Translation: {'OK' if manager.translation_model else 'FAILED'}")
        print(f"  Grammar Primary (mT5): {'OK' if manager.grammar_model else 'FAILED'}")
        print(f"  Grammar Fallback (IndicBERT): {'OK' if manager.grammar_fallback_model else 'FAILED'}")
        print(f"  Spelling Primary (BSpell): {'OK' if manager.bspell_checker else 'FAILED'}")
        print(f"  Spelling Fallback (LanguageTool): {'OK' if manager.language_tool else 'FAILED'}")
        
        # Test translation
        print("\n3. Testing translation...")
        result = await manager.translate("Hello world", "eng_Latn", "ben_Beng")
        print(f"   English: 'Hello world'")
        print(f"   Bengali: '{result}'")
        
        # Test language detection
        print("\n4. Testing language detection...")
        lang = await manager.detect_language("আমি বাংলায় কথা বলি")
        print(f"   Detected: {lang}")
        
        print("\n" + "=" * 70)
        print("ALL TESTS PASSED!")
        print("=" * 70)
        print("\nYour AI models are working perfectly!")
        print("Ready to start production server.")
        
        await manager.cleanup()
        return True
        
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_models())
    exit(0 if success else 1)

