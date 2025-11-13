#!/bin/bash

# GoBengali File Organization Script for macOS/Linux
# This script organizes all frontend and backend files into the gobengali/ main folder

echo "🚀 GoBengali File Organization Script"
echo "====================================="
echo ""

# Get current directory
currentDir=$(pwd)

# Create main directories
echo "📁 Creating folder structure..."
mkdir -p gobengali/frontend
mkdir -p gobengali/backend
echo "✓ Created gobengali/frontend/"
echo "✓ Created gobengali/backend/"
echo ""

# Move/Copy frontend files
echo "📦 Organizing frontend files..."
if [ -d "frontend" ]; then
    # Copy all frontend files
    cp -r frontend/* gobengali/frontend/ 2>/dev/null || true
    echo "✓ Frontend files copied to gobengali/frontend/"
else
    echo "⚠ frontend/ directory not found - creating empty structure"
    mkdir -p gobengali/frontend/app
    mkdir -p gobengali/frontend/components
    mkdir -p gobengali/frontend/lib
    mkdir -p gobengali/frontend/store
fi
echo ""

# Move/Copy backend files
echo "📦 Organizing backend files..."
if [ -d "backend" ]; then
    # Copy all backend files
    cp -r backend/* gobengali/backend/ 2>/dev/null || true
    echo "✓ Backend files copied to gobengali/backend/"
else
    echo "⚠ backend/ directory not found - creating empty structure"
    mkdir -p gobengali/backend/api
    mkdir -p gobengali/backend/models
fi
echo ""

# Display folder structure
echo "📋 Final structure:"
echo "gobengali/"
echo "├── README.md"
echo "├── .gitignore"
echo "├── LICENSE"
echo "├── frontend/"
echo "│   ├── app/"
echo "│   ├── components/"
echo "│   ├── lib/"
echo "│   ├── store/"
echo "│   └── package.json"
echo "└── backend/"
echo "    ├── api/"
echo "    ├── models/"
echo "    ├── main.py"
echo "    └── requirements.txt"
echo ""

# Success message
echo "✅ Organization complete!"
echo ""
echo "📝 Next steps:"
echo "1. cd gobengali/frontend"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "2. cd gobengali/backend"
echo "   python -m venv venv"
echo "   source venv/bin/activate"
echo "   pip install -r requirements.txt"
echo "   uvicorn main:app --reload"
echo ""
echo "🎉 Happy coding!"

