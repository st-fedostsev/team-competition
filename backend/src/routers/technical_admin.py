from fastapi import APIRouter, Request, Depends, Security, Response, status, UploadFile
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
import csv

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
    '/edit_user',
    summary='Изменить пользователя'
)
async def edit_user(edit_user_data: EditUserData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.technical_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(User).where(User.id == edit_user_data.user_id)
    target_user = session.exec(q).first()
    if not target_user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Пользователь не найден')
    
    if edit_user_data.new_rating is not None:
        target_user.personal_rating = edit_user_data.new_rating
    if edit_user_data.last_name is not None:
        target_user.last_name = edit_user_data.last_name
    if edit_user_data.first_name is not None:
        target_user.first_name = edit_user_data.first_name
    if edit_user_data.patronymic is not None:
        target_user.patronymic = edit_user_data.patronymic

    session.add(target_user)
    session.commit()
    
    return Message(msg='Действие выполнено успешно')

@router.post(
    '/import_users',
    summary='Импортировать пользователей из файла'
)
async def import_users(file: UploadFile, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.technical_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    file_data = (await file.read()).decode().split('\n')
    reader = csv.DictReader(file_data, delimiter=',')
    for row in reader:
        q = select(User).where((User.last_name == row['last_name']) & (User.first_name == row['first_name']) & (User.patronymic == row['patronymic']) & (User.student_id == row['student_id']))
        target_user = session.exec(q).first()
        if target_user is None:
            target_user = User(
                student_id=int(row['student_id']),
                last_name=row['last_name'],
                first_name=row['first_name'],
                patronymic=row['patronymic'],
                role=UserRole.student,
                created_at=datetime.utcnow(),
                personal_rating=int(row['personal_rating'])
            )
            session.add(target_user)
        else:
            target_user.personal_rating = int(row['personal_rating'])
    
    session.commit()

    return Message(msg='Данные импортированы')