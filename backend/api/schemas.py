from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    source_lang: Optional[str] = Field(None, description="Source language code (auto-detect if not provided)")
    target_lang: str = Field(default="ben_Beng", description="Target language code")

class TranslateResponse(BaseModel):
    translated_text: str
    detected_language: str
    confidence: float

class DetectLanguageRequest(BaseModel):
    text: str = Field(..., min_length=1)

class DetectLanguageResponse(BaseModel):
    language: str
    confidence: float

class CorrectionError(BaseModel):
    type: Literal["spelling", "grammar", "translation"]
    offset: int
    length: int
    original_text: str
    suggestions: List[str]
    message: str
    reason: Optional[str] = None
    confidence: Optional[float] = None

class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    lang: Optional[str] = Field(None, description="Language code (auto-detect if not provided)")
    check_grammar: bool = Field(default=True)
    check_spelling: bool = Field(default=True)

class AnalyzeResponse(BaseModel):
    translated_text: str
    detected_language: str
    errors: List[CorrectionError]
    word_count: int
    char_count: int

class SpellingCheckRequest(BaseModel):
    text: str = Field(..., min_length=1)

class SpellingCheckResponse(BaseModel):
    errors: List[CorrectionError]
    corrected_text: str

class GrammarCheckRequest(BaseModel):
    text: str = Field(..., min_length=1)

class GrammarCheckResponse(BaseModel):
    errors: List[CorrectionError]
    corrected_text: str

class ToneChangeRequest(BaseModel):
    text: str = Field(..., min_length=1)
    tone: Literal["formal", "journalistic", "literary"]

class ToneChangeResponse(BaseModel):
    modified_text: str
    changes_made: int

class ErrorResponse(BaseModel):
    error: str
    message: str
    status_code: int

