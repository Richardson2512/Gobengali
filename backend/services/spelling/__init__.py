"""
Spelling Service
Primary: SymSpell (Fast fuzzy matching with Bengali dictionary)
Fallback: LanguageTool (ML-based grammar and spelling)
"""
from .router import router

__all__ = ['router']

