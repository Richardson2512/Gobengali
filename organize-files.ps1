# GoBengali File Organization Script for Windows
# This script organizes all frontend and backend files into the gobengali/ main folder

Write-Host "🚀 GoBengali File Organization Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Get current directory
$currentDir = Get-Location

# Create main directories
Write-Host "📁 Creating folder structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "gobengali/frontend" | Out-Null
New-Item -ItemType Directory -Force -Path "gobengali/backend" | Out-Null
Write-Host "✓ Created gobengali/frontend/" -ForegroundColor Green
Write-Host "✓ Created gobengali/backend/" -ForegroundColor Green
Write-Host ""

# Move/Copy frontend files
Write-Host "📦 Organizing frontend files..." -ForegroundColor Yellow
if (Test-Path "frontend") {
    # Copy all frontend files
    Copy-Item -Path "frontend/*" -Destination "gobengali/frontend/" -Recurse -Force
    Write-Host "✓ Frontend files copied to gobengali/frontend/" -ForegroundColor Green
} else {
    Write-Host "⚠ frontend/ directory not found - creating empty structure" -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "gobengali/frontend/app" | Out-Null
    New-Item -ItemType Directory -Force -Path "gobengali/frontend/components" | Out-Null
    New-Item -ItemType Directory -Force -Path "gobengali/frontend/lib" | Out-Null
    New-Item -ItemType Directory -Force -Path "gobengali/frontend/store" | Out-Null
}
Write-Host ""

# Move/Copy backend files
Write-Host "📦 Organizing backend files..." -ForegroundColor Yellow
if (Test-Path "backend") {
    # Copy all backend files
    Copy-Item -Path "backend/*" -Destination "gobengali/backend/" -Recurse -Force
    Write-Host "✓ Backend files copied to gobengali/backend/" -ForegroundColor Green
} else {
    Write-Host "⚠ backend/ directory not found - creating empty structure" -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "gobengali/backend/api" | Out-Null
    New-Item -ItemType Directory -Force -Path "gobengali/backend/models" | Out-Null
}
Write-Host ""

# Display folder structure
Write-Host "📋 Final structure:" -ForegroundColor Cyan
Write-Host "gobengali/" -ForegroundColor White
Write-Host "├── README.md" -ForegroundColor Gray
Write-Host "├── .gitignore" -ForegroundColor Gray
Write-Host "├── LICENSE" -ForegroundColor Gray
Write-Host "├── frontend/" -ForegroundColor White
Write-Host "│   ├── app/" -ForegroundColor Gray
Write-Host "│   ├── components/" -ForegroundColor Gray
Write-Host "│   ├── lib/" -ForegroundColor Gray
Write-Host "│   ├── store/" -ForegroundColor Gray
Write-Host "│   └── package.json" -ForegroundColor Gray
Write-Host "└── backend/" -ForegroundColor White
Write-Host "    ├── api/" -ForegroundColor Gray
Write-Host "    ├── models/" -ForegroundColor Gray
Write-Host "    ├── main.py" -ForegroundColor Gray
Write-Host "    └── requirements.txt" -ForegroundColor Gray
Write-Host ""

# Success message
Write-Host "✅ Organization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. cd gobengali/frontend" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. cd gobengali/backend" -ForegroundColor White
Write-Host "   python -m venv venv" -ForegroundColor White
Write-Host "   venv\Scripts\activate" -ForegroundColor White
Write-Host "   pip install -r requirements.txt" -ForegroundColor White
Write-Host "   uvicorn main:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green

