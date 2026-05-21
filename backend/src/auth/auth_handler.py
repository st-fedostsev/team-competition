import time
from typing import Dict
from datetime import timedelta
from decouple import config
from fastapi_jwt import (
    JwtAccessBearerCookie,
    JwtAuthorizationCredentials,
    JwtRefreshBearer,
)


JWT_SECRET = config('jwt_secret')
JWT_ALGORITHM = config('jwt_algorithm')

access_security = JwtAccessBearerCookie(
    secret_key=JWT_SECRET, 
    algorithm=JWT_ALGORITHM,
    auto_error=False,
    access_expires_delta=timedelta(hours=2)
)

refresh_security = JwtRefreshBearer(
    secret_key=JWT_SECRET,
    algorithm=JWT_ALGORITHM,
    auto_error=True
)