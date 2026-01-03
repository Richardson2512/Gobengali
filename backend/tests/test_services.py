import pytest
import pytest_asyncio
from services.spelling.model import SpellingService
from services.translation.model import TranslationService

@pytest.mark.asyncio
async def test_spelling_service_initialization():
    service = SpellingService()
    assert service.primary_ready is False
    assert service.fallback_ready is False

@pytest.mark.asyncio
async def test_translation_service_initialization():
    service = TranslationService()
    assert service.ready is False
    assert service.model is None

# Note: We are avoiding calling .load() in these basic tests 
# to prevent downloading/loading 2GB+ models during standard test runs.
