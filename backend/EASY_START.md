# ⚡ Easy Start - Production Backend (3 Commands)

## Quick Fix for Errors

### Fix 1: Install email-validator
```powershell
pip install email-validator
```

### Fix 2: Skip PowerShell script, use Python instead
```powershell
python setup_production.py
```

## 🚀 Complete Setup (Step by Step)

### Step 1: Install Basic Dependencies
```powershell
cd C:\Users\AMD\gobengali\backend
.\venv\Scripts\activate
pip install email-validator
pip install -r requirements-production.txt
```

### Step 2: Install Spelling Checkers
```powershell
# Try BSpell (may fail - that's OK!)
pip install git+https://github.com/sagorbrur/bspell.git

# Install LanguageTool (fallback)
pip install language-tool-python
```

### Step 3: Run Setup
```powershell
python setup_production.py
```

This will download AI models (3GB, takes 15 minutes)

### Step 4: Start Server
```powershell
python main_production_lite.py
```

## ⚡ Super Quick Version (If Models Already Downloaded)

```powershell
cd C:\Users\AMD\gobengali\backend
.\venv\Scripts\activate
pip install email-validator
python main_production_lite.py
```

## 🧪 Test

Open new terminal:
```powershell
curl http://localhost:8000/health
```

## ✅ Success Indicators

You should see:
```
Starting GoBengali Production Server (Lite Mode)
Models will download on first request
INFO: Uvicorn running on http://0.0.0.0:8000
```

Then on first API call:
```
First request - loading models...
This will take 2-3 minutes (one-time setup)
Loading Translation Model...
Loading Grammar Model...
Loading Spelling Checker...
Models loaded successfully!
```

## 📊 What You Get

- ✅ mT5 for grammar
- ✅ BSpell for spelling  
- ✅ IndicBERT as fallback
- ✅ LanguageTool as fallback
- ✅ NLLB-200 for translation
- ✅ Bengali reasons
- ✅ NO hardcoded data

## 🔧 Troubleshooting

### Error: "BSpell not found"
**Solution**: That's OK! LanguageTool will be used as fallback
```powershell
pip install language-tool-python
```

### Error: "Out of memory"
**Solution**: Close other apps, or use smaller models

### Error: "Models download failed"
**Solution**: Check internet connection, try again

## 🎯 Quick Commands

```powershell
# Install dependencies
pip install email-validator language-tool-python

# Start server (models download automatically)
python main_production_lite.py

# Check health
curl http://localhost:8000/health

# Test analyze
curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d "{\"text\":\"Hello world\",\"check_grammar\":true,\"check_spelling\":true}"
```

That's it! Your backend is now AI-powered! 🚀

