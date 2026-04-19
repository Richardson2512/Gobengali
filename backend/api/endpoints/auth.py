from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime, timedelta, timezone
from typing import Optional
from collections import defaultdict
import logging
import time

from jose import JWTError, jwt
from passlib.context import CryptContext

from config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ---------------------------------------------------------------------------
# Rate limiting (in-memory, per-IP)
# ---------------------------------------------------------------------------
_rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 10  # max attempts per window


def _check_rate_limit(client_ip: str) -> None:
    """Raise 429 if the IP has exceeded the rate limit."""
    now = time.monotonic()
    timestamps = _rate_limit_store[client_ip]

    # Prune old entries outside the window
    _rate_limit_store[client_ip] = [
        t for t in timestamps if now - t < RATE_LIMIT_WINDOW
    ]
    timestamps = _rate_limit_store[client_ip]

    if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
        )

    _rate_limit_store[client_ip].append(now)


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class User(BaseModel):
    email: EmailStr
    full_name: str
    tier: str = "free"
    is_active: bool = True


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------------------------------------------------------------------------
# In-memory user store (placeholder until a real DB or auth provider is added)
# ---------------------------------------------------------------------------
users_db: dict[str, dict] = {}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def get_user(email: str) -> Optional[UserInDB]:
    if email in users_db:
        return UserInDB(**users_db[email])
    return None


def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
    user = get_user(email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("/register", response_model=User)
async def register(user_data: UserRegister, request: Request):
    """Register a new user."""
    _check_rate_limit(request.client.host)

    if user_data.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_data.password)
    users_db[user_data.email] = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": hashed_password,
        "tier": "free",
        "is_active": True,
    }

    return User(
        email=user_data.email,
        full_name=user_data.full_name,
        tier="free",
        is_active=True,
    )


@router.post("/token", response_model=Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token."""
    _check_rate_limit(request.client.host)

    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user


@router.post("/upgrade")
async def upgrade_to_pro(current_user: User = Depends(get_current_active_user)):
    """Upgrade user to Pro tier (placeholder — integrate payment gateway)."""
    if current_user.email in users_db:
        users_db[current_user.email]["tier"] = "pro"
        return {"message": "Successfully upgraded to Pro tier", "tier": "pro"}

    raise HTTPException(status_code=404, detail="User not found")
