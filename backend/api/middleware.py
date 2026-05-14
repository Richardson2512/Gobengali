from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from jose import JWTError, jwt

from config import settings
from database import SessionLocal
from models import User


class OptionalAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.user = None
        auth_header = request.headers.get("authorization")

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                email = payload.get("sub")
                if email:
                    db = SessionLocal()
                    try:
                        user = db.query(User).filter(User.email == email).first()
                        request.state.user = user
                    finally:
                        db.close()
            except JWTError:
                pass

        response = await call_next(request)
        return response
