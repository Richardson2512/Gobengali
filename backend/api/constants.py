"""
Shared constants for the GoBengali API.
"""

# Mapping from langdetect ISO codes to NLLB-200 language codes.
# NLLB-200 supports 200+ languages; this maps the ones langdetect commonly returns.
LANGDETECT_TO_NLLB: dict[str, str] = {
    "af": "afr_Latn",    # Afrikaans
    "ar": "arb_Arab",    # Arabic
    "bg": "bul_Cyrl",    # Bulgarian
    "bn": "ben_Beng",    # Bengali
    "ca": "cat_Latn",    # Catalan
    "cs": "ces_Latn",    # Czech
    "cy": "cym_Latn",    # Welsh
    "da": "dan_Latn",    # Danish
    "de": "deu_Latn",    # German
    "el": "ell_Grek",    # Greek
    "en": "eng_Latn",    # English
    "es": "spa_Latn",    # Spanish
    "et": "est_Latn",    # Estonian
    "fa": "pes_Arab",    # Persian
    "fi": "fin_Latn",    # Finnish
    "fr": "fra_Latn",    # French
    "gu": "guj_Gujr",    # Gujarati
    "he": "heb_Hebr",    # Hebrew
    "hi": "hin_Deva",    # Hindi
    "hr": "hrv_Latn",    # Croatian
    "hu": "hun_Latn",    # Hungarian
    "id": "ind_Latn",    # Indonesian
    "it": "ita_Latn",    # Italian
    "ja": "jpn_Jpan",    # Japanese
    "kn": "kan_Knda",    # Kannada
    "ko": "kor_Hang",    # Korean
    "lt": "lit_Latn",    # Lithuanian
    "lv": "lvs_Latn",    # Latvian
    "mk": "mkd_Cyrl",    # Macedonian
    "ml": "mal_Mlym",    # Malayalam
    "mr": "mar_Deva",    # Marathi
    "ne": "npi_Deva",    # Nepali
    "nl": "nld_Latn",    # Dutch
    "no": "nob_Latn",    # Norwegian
    "pa": "pan_Guru",    # Punjabi
    "pl": "pol_Latn",    # Polish
    "pt": "por_Latn",    # Portuguese
    "ro": "ron_Latn",    # Romanian
    "ru": "rus_Cyrl",    # Russian
    "sk": "slk_Latn",    # Slovak
    "sl": "slv_Latn",    # Slovenian
    "sq": "als_Latn",    # Albanian
    "sv": "swe_Latn",    # Swedish
    "sw": "swh_Latn",    # Swahili
    "ta": "tam_Taml",    # Tamil
    "te": "tel_Telu",    # Telugu
    "th": "tha_Thai",    # Thai
    "tl": "tgl_Latn",    # Tagalog
    "tr": "tur_Latn",    # Turkish
    "uk": "ukr_Cyrl",    # Ukrainian
    "ur": "urd_Arab",    # Urdu
    "vi": "vie_Latn",    # Vietnamese
    "zh-cn": "zho_Hans", # Chinese (Simplified)
    "zh-tw": "zho_Hant", # Chinese (Traditional)
}

# Default language when detection fails
DEFAULT_NLLB_LANG = "eng_Latn"


def langdetect_to_nllb(langdetect_code: str) -> str:
    """Convert a langdetect code to an NLLB-200 code, defaulting to English."""
    return LANGDETECT_TO_NLLB.get(langdetect_code, DEFAULT_NLLB_LANG)
