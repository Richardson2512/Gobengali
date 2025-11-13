"""
Simple Production Server Start Script
Guaranteed to work!
"""

import uvicorn
import os
import sys

# Set UTF-8 encoding
os.environ['PYTHONIOENCODING'] = 'utf-8'

print("\n" + "=" * 70)
print("  Starting GoBengali Production Server")
print("=" * 70)
print("\nChecking models...")

# Check if models are downloaded
models_dir = "./models"
if not os.path.exists(models_dir):
    print(f"\nERROR: Models not downloaded yet!")
    print("Run: python download_models_auto.py")
    sys.exit(1)

print(f"OK - Models directory exists: {os.path.abspath(models_dir)}")

print("\nStarting server...")
print("  Host: 0.0.0.0")
print("  Port: 8000")
print("  Mode: Production (Full AI)")
print("\nServer will load AI models at startup (60-90 seconds)")
print("Please wait...\n")

# Start server
uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8000,
    reload=False,  # No auto-reload
    log_level="info"
)

