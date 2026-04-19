import os
import pytest
from httpx import AsyncClient, ASGITransport
import asyncio

# Set required env vars BEFORE importing the app
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-testing-only-min-32chars!")

from main import app


@pytest.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
