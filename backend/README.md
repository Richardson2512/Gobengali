# GoBengali Backend

FastAPI backend for GoBengali Bengali writing assistant with ML model integration.

## 🚀 Quick Start

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000

# Server runs at:
# - API: http://localhost:8000
# - Docs: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
```

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py               # Configuration and settings
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
│
├── api/
│   ├── __init__.py         # API router aggregation
│   ├── schemas.py          # Pydantic request/response models
│   └── endpoints/
│       ├── analysis.py     # Main analyze endpoint
│       ├── translation.py  # Translation endpoints
│       ├── grammar.py      # Grammar checking
│       ├── spelling.py     # Spelling correction
│       └── auth.py         # User authentication (JWT)
│
└── models/
    ├── __init__.py
    └── model_manager.py    # ML model management
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Application
APP_NAME=GoBengali
APP_VERSION=1.0.0
DEBUG=True
API_HOST=0.0.0.0
API_PORT=8000

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# MongoDB (optional)
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=gobengali

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ML Models
MODEL_CACHE_DIR=./models
TRANSLATION_MODEL=facebook/nllb-200-distilled-1.3B
GRAMMAR_MODEL=ai4bharat/IndicBERTv2-MLM-only
USE_GPU=False

# Rate Limits
FREE_TIER_DAILY_WORDS=1000
PRO_TIER_DAILY_WORDS=999999
```

## 📡 API Endpoints

### Analysis
```
POST /analyze
- Complete text analysis with translation and corrections
- Combines translation, grammar, and spelling checks
```

### Translation
```
POST /translate
- Translate text from source to target language

POST /detect-language
- Detect the language of input text
```

### Grammar & Spelling
```
POST /grammar/check
- Check grammar in Bengali text

POST /spelling/check
- Check spelling in Bengali text
```

### Authentication
```
POST /auth/register
- Register new user account

POST /auth/token
- Login and receive JWT token

GET /auth/me
- Get current user profile (requires authentication)

POST /auth/upgrade
- Upgrade user to Pro tier
```

### Health Check
```
GET /health
- Check API health and model status

GET /
- API information and version
```

## 🤖 ML Models

### NLLB-200 Translation Model

**Model**: `facebook/nllb-200-distilled-1.3B`

- Supports 200+ languages
- Translates to Bengali (ben_Beng)
- Auto-downloads on first run (~1.5GB)
- Cached in `./models/` directory

**Language Codes**:
- `eng_Latn` - English
- `ben_Beng` - Bengali
- `hin_Deva` - Hindi
- `arb_Arab` - Arabic
- `spa_Latn` - Spanish

### Grammar Model (Ready for Integration)

Framework prepared for:
- mT5 fine-tuned on Bengali grammar
- IndicBERT fine-tuned model
- Custom grammar checking model

### Spelling Model (Ready for Integration)

Framework prepared for:
- BSpell (Bengali spelling checker)
- Custom CNN + BERT model
- Dictionary-based checker

## 🔐 Authentication

### JWT Token Authentication

```python
# Register user
POST /auth/register
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "User Name"
}

# Login
POST /auth/token
{
  "username": "user@example.com",
  "password": "securepassword"
}

# Use token
Headers: {
  "Authorization": "Bearer <your-token-here>"
}
```

### Password Security
- Bcrypt hashing
- Secure token generation
- Token expiration (30 minutes)

## 🧪 Testing

### Test with curl

```bash
# Health check
curl http://localhost:8000/health

# Analyze text
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello World",
    "check_grammar": true,
    "check_spelling": true
  }'

# Translate
curl -X POST http://localhost:8000/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello",
    "target_lang": "ben_Beng"
  }'
```

### Test with Python

```python
import requests

# Analyze text
response = requests.post(
    "http://localhost:8000/analyze",
    json={
        "text": "Hello World",
        "check_grammar": True,
        "check_spelling": True
    }
)
print(response.json())

# Register user
response = requests.post(
    "http://localhost:8000/auth/register",
    json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User"
    }
)
print(response.json())
```

### Interactive API Documentation

Open http://localhost:8000/docs for Swagger UI

Features:
- Try endpoints directly
- See request/response schemas
- Test authentication
- View all available endpoints

## 🚀 Deployment

### Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Set environment variables in Railway dashboard.

### Render

Create `render.yaml`:
```yaml
services:
  - type: web
    name: gobengali-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t gobengali-backend .
docker run -p 8000:8000 gobengali-backend
```

### AWS EC2

```bash
# Install dependencies
sudo apt update
sudo apt install python3.10 python3.10-venv -y

# Clone and setup
git clone <repo>
cd gobengali/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run with systemd
sudo systemctl enable gobengali
sudo systemctl start gobengali
```

## 🔧 Model Manager

### Load Models

```python
from models.model_manager import ModelManager

# Initialize
manager = ModelManager(
    translation_model_name="facebook/nllb-200-distilled-1.3B",
    grammar_model_name="ai4bharat/IndicBERTv2-MLM-only",
    use_gpu=False
)

# Load models
await manager.load_models()
```

### Use Models

```python
# Translate
translated = await manager.translate(
    text="Hello",
    source_lang="eng_Latn",
    target_lang="ben_Beng"
)

# Check grammar
errors = await manager.check_grammar("Bengali text here")

# Check spelling
errors = await manager.check_spelling("Bengali text here")
```

## 📊 Performance

### Optimization Tips

1. **Enable GPU**:
   ```env
   USE_GPU=True
   ```

2. **Use Model Quantization**:
   ```python
   model = AutoModelForSeq2SeqLM.from_pretrained(
       model_name,
       torch_dtype=torch.float16
   )
   ```

3. **Cache Results** (Redis):
   - Cache translation results
   - Reduce duplicate processing

4. **Batch Processing**:
   - Process multiple requests together
   - Use Celery for background tasks

## 🐛 Troubleshooting

### Common Issues

**Port 8000 in use:**
```bash
uvicorn main:app --reload --port 8001
```

**Models not downloading:**
```bash
# Check disk space
df -h

# Manual download
python -c "from transformers import AutoModelForSeq2SeqLM; AutoModelForSeq2SeqLM.from_pretrained('facebook/nllb-200-distilled-1.3B')"
```

**Out of memory:**
- Set `USE_GPU=False`
- Reduce batch size
- Use smaller model variant

**Import errors:**
```bash
# Ensure venv is activated
which python

# Reinstall
pip install -r requirements.txt
```

**CORS errors:**
- Check CORS_ORIGINS in .env
- Add frontend URL to allowed origins

## 📚 Dependencies

### Core
- `fastapi`: 0.109.0
- `uvicorn[standard]`: 0.27.0
- `pydantic`: 2.5.0

### ML/AI
- `transformers`: 4.37.0
- `torch`: 2.2.0
- `sentencepiece`: 0.1.99
- `langdetect`: 1.0.9

### Authentication
- `python-jose[cryptography]`: 3.3.0
- `passlib[bcrypt]`: 1.7.4

### Database (optional)
- `redis`: 5.0.1
- `pymongo`: 4.6.1
- `celery`: 5.3.6

## 🔗 Related Documentation

- [Main README](../README.md)
- [Frontend README](../frontend/README.md)
- [API Documentation](http://localhost:8000/docs)

---

**Built with FastAPI and PyTorch**

