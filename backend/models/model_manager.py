import logging

logger = logging.getLogger(__name__)


class ModelManager:
    def __init__(self, translation_model_name=None, grammar_model_name=None, use_gpu=False, cache_dir="./models"):
        self.translation_model_name = translation_model_name
        self.grammar_model_name = grammar_model_name
        self.use_gpu = use_gpu
        self.cache_dir = cache_dir

    async def load_models(self):
        logger.info("Model manager: models load deferred to individual services (lazy loading)")

    async def cleanup(self):
        pass
