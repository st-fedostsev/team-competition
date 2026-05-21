from fastapi import FastAPI, Depends, Security
from fastapi.security import HTTPBearer
from sqlmodel import Session, select
from fastapi.responses import JSONResponse
from database.session import get_session_cm
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials, JwtAccessBearer
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from models import User
from typing import Any

class BanMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        credentials = await access_security._bearer(request)
        credentials = await access_security._get_credentials(bearer=credentials, cookie=None)
        if not credentials:
            return await call_next(request)

        with get_session_cm() as session:
            q = select(User).where(User.id == credentials['id'])
            user = session.exec(q).first()
            if user.is_blocked:
                return JSONResponse(
                    status_code=403,
                    content={'message': 'Пользователь заблокирован администратором'}
                )
        
        return await call_next(request)