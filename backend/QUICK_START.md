# GoBengali Backend - Quick Start

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### Step 2: Run the Server

```bash
# Start server
uvicorn main:app --reload --port 8000

# Server starts at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Step 3: Test API

Open browser: `http://localhost:8000/docs`

Try the `/analyze` endpoint with:
```json
{
  "text": "Hello World",
  "check_grammar": true,
  "check_spelling": true
}
```

## 📡 API Endpoints

### Main Endpoint
- `POST /analyze` - Translate + Check Grammar + Spelling

### Translation
- `POST /translate` - Translate text
- `POST /detect-language` - Detect language

### Checking
- `POST /grammar/check` - Grammar only
- `POST /spelling/check` - Spelling only

### Auth
- `POST /auth/register` - Sign up
- `POST /auth/token` - Login
- `GET /auth/me` - Get profile

## 🤖 ML Models

### First Run
On first run, NLLB-200 model (~1.5GB) will download automatically. This takes 5-15 minutes.

### Model Location
Models cached in `./models/` directory

### GPU Support
Set `USE_GPU=True` in `.env` if you have NVIDIA GPU

## 🔧 Configuration

Edit `backend/.env`:

```env
DEBUG=True              # Development mode
USE_GPU=False           # Enable GPU
MODEL_CACHE_DIR=./models
TRANSLATION_MODEL=facebook/nllb-200-distilled-1.3B
```

## 🧪 Test Endpoints

### Using curl

```bash
# Health check
curl http://localhost:8000/health

# Translate
curl -X POST http://localhost:8000/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "target_lang": "ben_Beng"}'

# Analyze (full)
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World", "check_grammar": true}'
```

### Using Python

```python
import requests

response = requests.post(
    "http://localhost:8000/analyze",
    json={
        "text": "Hello World",
        "check_grammar": True,
        "check_spelling": True
    }
)

print(response.json())
```

## 🔐 Authentication

### Register User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"
```

### Use Token
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Project Structure

```
backend/
├── main.py              # FastAPI app
├── config.py            # Settings
├── api/
│   ├── schemas.py       # Pydantic models
│   └── endpoints/       # API routes
│       ├── analysis.py
│       ├── translation.py
│       ├── grammar.py
│       ├── spelling.py
│       └── auth.py
└── models/
    └── model_manager.py # ML models
```

## 🐛 Troubleshooting

### Port in use
```bash
# Use different port
uvicorn main:app --reload --port 8001
```

### Models not loading
```bash
# Check disk space (need ~2GB)
df -h

# Manually download
python -c "from transformers import AutoModelForSeq2SeqLM; AutoModelForSeq2SeqLM.from_pretrained('facebook/nllb-200-distilled-1.3B')"
```

### Import errors
```bash
# Make sure venv is activated
which python  # Should show venv path

# Reinstall
pip install -r requirements.txt
```

## 📚 Next Steps

1. ✅ Backend running
2. ✅ Test API endpoints
3. ✅ Try authentication
4. → Start frontend (`cd ../frontend && npm run dev`)
5. → Test full application
6. → Deploy to production

## 🔗 Useful Links

- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

---

**Happy Coding! 🚀**

