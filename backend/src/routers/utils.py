from sqlmodel import Session, select
from fastapi import APIRouter, Request, Depends, Security, Response, status
from fastapi_jwt import JwtAuthorizationCredentials
from models import User

async def authorize_request(credentials: JwtAuthorizationCredentials, session: Session):
    if not credentials:
        return False

    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        return False
    
    return True