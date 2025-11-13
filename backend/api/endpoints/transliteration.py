"""
Transliteration Endpoint - Routes to Transliteration Service
This file now just routes to the modular service - NO duplicate code
"""
from fastapi import APIRouter
from services.transliteration.router import router as translit_router

# Re-export the router from the service
router = translit_router

