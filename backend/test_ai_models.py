"""
Test script to download and verify AI models
Run with: python test_ai_models.py
"""

import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_models():
    """Test loading all AI models"""
    print("\n" + "=" * 70)
    print("  Testing AI Models")
    print("=" * 70 + "\n")
    
    try:
        from models.production_model_manager import ProductionModelManager
        
        print("[OK] ProductionModelManager imported successfully\n")
        
        # Create manager
        print("Creating model manager...")
        manager = ProductionModelManager(
            translation_model_name="facebook/nllb-200-distilled-600M",
            grammar_model_name="google/mt5-small",
            grammar_fallback_name="ai4bharat/IndicBERTv2-MLM-only",
            use_gpu=False,
            cache_dir="./models"
        )
        
        print("[OK] Manager created\n")
        
        # Load models
        print("Loading models (this may take 5-15 minutes first time)...")
        print("Models will be cached for future use\n")
        
        await manager.load_models()
        
        print("\n" + "=" * 70)
        print("  [SUCCESS] All Models Loaded Successfully!")
        print("=" * 70)
        
        # Test translation
        print("\nTesting translation...")
        result = await manager.translate("Hello world", "eng_Latn", "ben_Beng")
        print(f"   Input: Hello world")
        print(f"   Output: {result}")
        
        # Test spelling
        print("\nTesting spelling check...")
        errors = await manager.check_spelling("Test Bengali text")
        print(f"   Found {len(errors)} errors")
        if errors:
            print(f"   Example: {errors[0]}")
        
        # Test grammar
        print("\nTesting grammar check...")
        errors = await manager.check_grammar("Test text")
        print(f"   Found {len(errors)} errors")
        if errors:
            print(f"   Example: {errors[0]}")
        
        # Get metrics
        print("\nMetrics:")
        metrics = manager.get_metrics()
        for key, value in metrics.items():
            print(f"   {key}: {value}")
        
        print("\n[SUCCESS] All tests passed!")
        print("You can now run: python main_production_lite.py\n")
        
        # Cleanup
        await manager.cleanup()
        
    except Exception as e:
        print(f"\n[ERROR]: {e}")
        import traceback
        traceback.print_exc()
        print("\nTry installing missing dependencies:")
        print("  pip install transformers torch sentencepiece language-tool-python")

if __name__ == "__main__":
    asyncio.run(test_models())

