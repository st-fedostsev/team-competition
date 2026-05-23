from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select
from database.session import get_session
from models import User, UserRole
from pwdlib import PasswordHash
from schemas.technical_admin import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/technical_admin',
    tags=['technical_admin'],
    responses={
        '200': {
            'model': Message,
            'description': 'Операция завершена успешно'
        },
        '400': {
            'model': Message,
            'description': 'Неверный запрос'
        },
        '403': {
            'model': Message,
            'description': 'Неавторизованный запрос'
        },
        '401': {
            'model': Message,
            'description': 'Запрос не авториован(неправильно передан/не передан JWT токен)'
        },
        '422': {
            'description': 'JSON передан неправильно, см. ответ сервера'
        }
    }
)

pwd_context = PasswordHash.recommended()

@router.post(
    '/ban',
    summary='Заблокировать/разблокировать пользователя'
)
async def ban_user(ban_data: BanData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.technical_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(User).where(User.id == ban_data.user_id)
    target_user = session.exec(q).first()
    if not target_user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Пользователь не найден')
    
    target_user.is_blocked = ban_data.ban
    session.add(target_user)
    session.commit()
    
    return Message(msg='Действие выполнено успешно')

@router.post(
    '/edit_rating',
    summary='Изменить персональный рейтинг пользователя'
)
async def ban_user(edit_rating_data: EditRatingData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.technical_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(User).where(User.id == edit_rating_data.user_id)
    target_user = session.exec(q).first()
    if not target_user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Пользователь не найден')
    
    target_user.personal_rating = edit_rating_data.new_rating
    session.add(target_user)
    session.commit()
    
    return Message(msg='Действие выполнено успешно')

