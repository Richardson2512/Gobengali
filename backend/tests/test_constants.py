from api.constants import langdetect_to_nllb, LANGDETECT_TO_NLLB, DEFAULT_NLLB_LANG


def test_known_languages_map_correctly():
    assert langdetect_to_nllb("en") == "eng_Latn"
    assert langdetect_to_nllb("bn") == "ben_Beng"
    assert langdetect_to_nllb("hi") == "hin_Deva"
    assert langdetect_to_nllb("ar") == "arb_Arab"
    assert langdetect_to_nllb("fr") == "fra_Latn"
    assert langdetect_to_nllb("ja") == "jpn_Jpan"
    assert langdetect_to_nllb("ur") == "urd_Arab"


def test_unknown_language_defaults_to_english():
    assert langdetect_to_nllb("xx") == DEFAULT_NLLB_LANG
    assert langdetect_to_nllb("") == DEFAULT_NLLB_LANG
    assert langdetect_to_nllb("unknown") == DEFAULT_NLLB_LANG


def test_lang_map_has_minimum_coverage():
    """Ensure we have at least 50 language mappings."""
    assert len(LANGDETECT_TO_NLLB) >= 50
