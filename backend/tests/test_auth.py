import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_success(async_client: AsyncClient):
    response = await async_client.post(
        "/api/auth/register",
        json={
            "email": "newuser@test.com",
            "password": "StrongPass1",
            "full_name": "Test User",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@test.com"
    assert data["tier"] == "free"
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_weak_password_rejected(async_client: AsyncClient):
    response = await async_client.post(
        "/api/auth/register",
        json={
            "email": "weak@test.com",
            "password": "short",
            "full_name": "Weak User",
        },
    )
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_register_no_uppercase_rejected(async_client: AsyncClient):
    response = await async_client.post(
        "/api/auth/register",
        json={
            "email": "nouppercase@test.com",
            "password": "alllowercase1",
            "full_name": "No Upper",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_duplicate_email(async_client: AsyncClient):
    # Register first
    await async_client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@test.com",
            "password": "StrongPass1",
            "full_name": "First User",
        },
    )
    # Try to register again
    response = await async_client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@test.com",
            "password": "StrongPass1",
            "full_name": "Second User",
        },
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient):
    # Register first
    await async_client.post(
        "/api/auth/register",
        json={
            "email": "login@test.com",
            "password": "StrongPass1",
            "full_name": "Login User",
        },
    )

    # Login
    response = await async_client.post(
        "/api/auth/token",
        data={
            "username": "login@test.com",
            "password": "StrongPass1",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(async_client: AsyncClient):
    # Register first
    await async_client.post(
        "/api/auth/register",
        json={
            "email": "wrongpass@test.com",
            "password": "StrongPass1",
            "full_name": "Wrong Pass User",
        },
    )

    # Login with wrong password
    response = await async_client.post(
        "/api/auth/token",
        data={
            "username": "wrongpass@test.com",
            "password": "WrongPassword1",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_endpoint_requires_auth(async_client: AsyncClient):
    response = await async_client.get("/api/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_endpoint_with_token(async_client: AsyncClient):
    # Register
    await async_client.post(
        "/api/auth/register",
        json={
            "email": "metest@test.com",
            "password": "StrongPass1",
            "full_name": "Me User",
        },
    )

    # Login
    login_response = await async_client.post(
        "/api/auth/token",
        data={"username": "metest@test.com", "password": "StrongPass1"},
    )
    token = login_response.json()["access_token"]

    # Access /me
    response = await async_client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "metest@test.com"
