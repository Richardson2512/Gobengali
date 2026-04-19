import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root(async_client: AsyncClient):
    response = await async_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert "version" in data


@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "models_loaded" in data
    assert "version" in data


@pytest.mark.asyncio
async def test_404_returns_error(async_client: AsyncClient):
    response = await async_client.get("/nonexistent")
    assert response.status_code == 404
