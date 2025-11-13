# GoBengali Production Setup Script for Windows PowerShell
# Run with: .\setup_production.ps1

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  GoBengali Production Setup" -ForegroundColor Cyan
Write-Host "  Full AI Backend - No Mock Data" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""

# Check if virtual environment is activated
if (-not $env:VIRTUAL_ENV) {
    Write-Host "WARNING: Virtual environment not activated!" -ForegroundColor Yellow
    Write-Host "Run: .\venv\Scripts\activate" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Continue anyway? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        exit
    }
}

Write-Host "Step 1: Installing Core AI Libraries" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Gray

Write-Host ""
Write-Host "Installing PyTorch (CPU version)..." -ForegroundColor Yellow
pip install torch==2.1.0 --index-url https://download.pytorch.org/whl/cpu

Write-Host ""
Write-Host "Installing Transformers and dependencies..." -ForegroundColor Yellow
pip install transformers==4.35.0 sentencepiece==0.1.99 accelerate==0.24.0

Write-Host ""
Write-Host "Installing Language Detection..." -ForegroundColor Yellow
pip install langdetect==1.0.9

Write-Host ""
Write-Host "Step 2: Installing Spelling Checkers" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Gray

Write-Host ""
Write-Host "Installing BSpell (Primary)..." -ForegroundColor Yellow
pip install git+https://github.com/sagorbrur/bspell.git

if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: BSpell installation failed, installing alternative..." -ForegroundColor Yellow
    pip install symspellpy==6.7.7
}

Write-Host ""
Write-Host "Installing LanguageTool (Fallback)..." -ForegroundColor Yellow
pip install language-tool-python==2.7.1

Write-Host ""
Write-Host "Installing email-validator (required by pydantic)..." -ForegroundColor Yellow
pip install email-validator

Write-Host ""
Write-Host "Step 3: Installing Remaining Dependencies" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Gray

pip install -r requirements-production.txt

Write-Host ""
Write-Host "Step 4: Downloading AI Models" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Gray

Write-Host ""
Write-Host "WARNING: This will download about 3GB of AI models" -ForegroundColor Yellow
Write-Host "This is a ONE-TIME download (models are cached)" -ForegroundColor Gray
$response = Read-Host "Download models now? (Y/n)"

if ($response -eq 'n' -or $response -eq 'N') {
    Write-Host ""
    Write-Host "Skipping model download" -ForegroundColor Yellow
    Write-Host "Models will download automatically on first API call" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "Downloading models..." -ForegroundColor Yellow
    python setup_production.py
}

Write-Host ""
Write-Host "Step 5: Creating Configuration" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Gray

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
# GoBengali Production Configuration
USE_GPU=false
MODEL_CACHE_DIR=./models
MODEL_TIMEOUT=5.0

# Primary Models
TRANSLATION_MODEL=facebook/nllb-200-distilled-600M
GRAMMAR_MODEL=google/mt5-small
GRAMMAR_FALLBACK=ai4bharat/IndicBERTv2-MLM-only

# API Settings
DEBUG=true
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
"@
    
    Set-Content -Path ".env" -Value $envContent
    Write-Host "Configuration created successfully" -ForegroundColor Green
} else {
    Write-Host "INFO: .env already exists" -ForegroundColor Gray
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start server: python main_production.py" -ForegroundColor White
Write-Host "2. Check health: curl http://localhost:8000/health" -ForegroundColor White
Write-Host "3. View docs: http://localhost:8000/docs" -ForegroundColor White

Write-Host ""
Write-Host "What you get:" -ForegroundColor Cyan
Write-Host "  + mT5 for grammar checking" -ForegroundColor Green
Write-Host "  + BSpell for Bengali spelling" -ForegroundColor Green
Write-Host "  + IndicBERT as fallback" -ForegroundColor Green
Write-Host "  + LanguageTool as fallback" -ForegroundColor Green
Write-Host "  + NLLB-200 for translation" -ForegroundColor Green
Write-Host "  + Bengali reasons for all errors" -ForegroundColor Green
Write-Host "  + NO hardcoded data - 100% AI!" -ForegroundColor Green

Write-Host ""
Write-Host "Your backend is ready for production!" -ForegroundColor Cyan
Write-Host ""
