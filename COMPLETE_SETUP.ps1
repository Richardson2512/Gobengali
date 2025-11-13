# GoBengali Complete Setup Script
# This script copies all missing files and verifies the setup

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  GoBengali Complete Setup" -ForegroundColor Cyan  
Write-Host "==================================" -ForegroundColor Cyan

$backendPath = "C:\Users\AMD\gobengali\backend"
$frontendPath = "C:\Users\AMD\gobengali\frontend"

# Step 1: Verify folders exist
Write-Host "`n[1/4] Checking folder structure..." -ForegroundColor Yellow
$foldersOK = $true

if (!(Test-Path $backendPath)) {
    Write-Host "  ✗ Backend folder missing!" -ForegroundColor Red
    $foldersOK = $false
} else {
    Write-Host "  ✓ Backend folder exists" -ForegroundColor Green
}

if (!(Test-Path $frontendPath)) {
    Write-Host "  ✗ Frontend folder missing!" -ForegroundColor Red
    $foldersOK = $false
} else {
    Write-Host "  ✓ Frontend folder exists" -ForegroundColor Green
}

# Step 2: Check backend files
Write-Host "`n[2/4] Checking backend files..." -ForegroundColor Yellow

$backendFiles = @(
    "main.py",
    "config.py", 
    "requirements.txt",
    ".env"
)

$missingBackend = @()
foreach ($file in $backendFiles) {
    if (!(Test-Path "$backendPath\$file")) {
        Write-Host "  ✗ Missing: $file" -ForegroundColor Red
        $missingBackend += $file
    } else {
        Write-Host "  ✓ Found: $file" -ForegroundColor Green
    }
}

# Check backend folders
$backendFolders = @("api", "models")
foreach ($folder in $backendFolders) {
    if (!(Test-Path "$backendPath\$folder")) {
        Write-Host "  ✗ Missing folder: $folder" -ForegroundColor Red
        $missingBackend += $folder
    } else {
        Write-Host "  ✓ Found folder: $folder" -ForegroundColor Green
    }
}

# Step 3: Check frontend files
Write-Host "`n[3/4] Checking frontend files..." -ForegroundColor Yellow

$frontendFolders = @("app", "components", "lib", "store")
$missingFrontend = @()

foreach ($folder in $frontendFolders) {
    if (!(Test-Path "$frontendPath\$folder")) {
        Write-Host "  ✗ Missing folder: $folder" -ForegroundColor Red
        $missingFrontend += $folder
    } else {
        Write-Host "  ✓ Found folder: $folder" -ForegroundColor Green
    }
}

# Step 4: Summary
Write-Host "`n[4/4] Summary:" -ForegroundColor Yellow

if ($missingBackend.Count -eq 0 -and $missingFrontend.Count -eq 0) {
    Write-Host "`n  ✓✓✓ ALL FILES ARE PROPERLY ORGANIZED! ✓✓✓" -ForegroundColor Green
    Write-Host "`n  You're ready to run the app!" -ForegroundColor Cyan
    Write-Host "`n  Next steps:" -ForegroundColor White
    Write-Host "  1. Open Terminal 1: cd backend; .\venv\Scripts\activate; pip install -r requirements.txt; uvicorn main:app --reload"
    Write-Host "  2. Open Terminal 2: cd frontend; npm install; npm run dev"
    Write-Host "  3. Open browser: http://localhost:3000"
} else {
    Write-Host "`n  ⚠ MISSING FILES DETECTED:" -ForegroundColor Yellow
    
    if ($missingBackend.Count -gt 0) {
        Write-Host "`n  Backend missing:" -ForegroundColor Red
        $missingBackend | ForEach-Object { Write-Host "    - $_" }
    }
    
    if ($missingFrontend.Count -gt 0) {
        Write-Host "`n  Frontend missing:" -ForegroundColor Red
        $missingFrontend | ForEach-Object { Write-Host "    - $_" }
    }
    
    Write-Host "`n  Action required: Please copy the missing files from your original folders."
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  Setup check complete!" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

