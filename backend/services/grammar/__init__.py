"""
Grammar Service
Primary: mT5 (Google's multilingual T5 - best for Bengali grammar)
Fallback: IndicBERT (Indian languages BERT)
"""
from .router import router

__all__ = ['router']

