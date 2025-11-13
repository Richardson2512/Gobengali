# GoBengali Modular Backend Startup Script
# Starts all AI services independently

Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 79) -ForegroundColor Green
Write-Host " GoBengali - Modular AI Backend" -ForegroundColor Cyan
Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 79) -ForegroundColor Green

# Navigate to backend directory
Set-Location $PSScriptRoot

# Activate virtual environment
Write-Host "`nActivating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Set encoding
$env:PYTHONIOENCODING = "utf-8"

Write-Host "`nStarting modular backend..." -ForegroundColor Green
Write-Host "  Transliteration: READY (instant)" -ForegroundColor Cyan
Write-Host "  Translation: Loading in background (30-60s)..." -ForegroundColor Yellow
Write-Host "  Grammar: Loading in background (30-60s)..." -ForegroundColor Yellow
Write-Host "  Spelling: Loading in background (10-20s)..." -ForegroundColor Yellow

Write-Host "`nBackend will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop`n" -ForegroundColor Yellow

# Start the server
python main_modular.py

