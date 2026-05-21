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

class AuthMiddleware(BaseHTTPMiddleware):
    EXCLUDED_PATHS = ['/favicon.ico', '/docs', '/openapi.json', '/users/login', '/users/login_admin']

    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.url.path in self.EXCLUDED_PATHS:
            return await call_next(request)

        credentials = await access_security._bearer(request)
        credentials = await access_security._get_credentials(bearer=credentials, cookie=None)
        if not credentials:
            return JSONResponse(
                status_code=403,
                content={'message': 'Пользователь не авторизован'}
            )

        with get_session_cm() as session:
            q = select(User).where(User.id == credentials['id'])
            user = session.exec(q).first()
            if not user:
                return JSONResponse(
                    status_code=403,
                    content={'message': 'Пользователь не авторизован'}
                )
        
        return await call_next(request)