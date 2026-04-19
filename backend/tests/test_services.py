import pytest
from services.spelling.model import SpellingService
from services.translation.model import TranslationService
from services.grammar.model import GrammarService
from services.transliteration.model import TransliterationService


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
    assert service.last_confidence == 0.0


@pytest.mark.asyncio
async def test_grammar_service_initialization():
    service = GrammarService()
    assert service.primary_ready is False
    assert service.fallback_ready is False


def test_transliteration_service_initialization():
    """Transliteration loads eagerly via indic-transliteration library."""
    service = TransliterationService()
    # ready depends on whether the library is installed
    assert isinstance(service.ready, bool)


@pytest.mark.asyncio
async def test_translation_same_language_returns_input():
    """When source == target, translate should return the same text."""
    service = TranslationService()
    service.ready = True

    result = await service.translate("hello", source_lang="eng_Latn", target_lang="eng_Latn")
    assert result == "hello"
    assert service.last_confidence == 1.0


def test_grammar_compare_texts_filters_special_tokens():
    service = GrammarService()

    # Should return empty when corrected text is just special tokens
    errors = service._compare_texts("hello world", "<extra_id_0> <pad>")
    assert errors == []

    # Should return empty when texts are identical
    errors = service._compare_texts("hello world", "hello world")
    assert errors == []


def test_grammar_compare_texts_detects_differences():
    service = GrammarService()

    errors = service._compare_texts("hello wrold", "hello world")
    assert len(errors) == 1
    assert errors[0]["original_text"] == "wrold"
    assert errors[0]["suggestions"] == ["world"]
    assert errors[0]["type"] == "grammar"


# Note: We avoid calling .load() in basic tests to prevent
# downloading/loading 2GB+ models during standard test runs.
