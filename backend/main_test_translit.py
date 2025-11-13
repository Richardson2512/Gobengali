"""
Quick test server for transliteration API only
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GoBengali Test - Transliteration Only")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import transliteration endpoint
from api.endpoints.transliteration import router as translit_router
app.include_router(translit_router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "running", "message": "Transliteration test server"}

@app.get("/health")
async def health():
    return {"status": "healthy", "models_loaded": False}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting transliteration test server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)

