from fastapi import APIRouter, Request, Depends, Security, Response, status, UploadFile
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, Notification, KnowledgePost, ModerationStatus
from pwdlib import PasswordHash
from schemas.content_manager import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config
import csv

router = APIRouter(
    prefix='/content_manager',
    tags=['content_manager'],
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
    '/send_notification',
    summary='Отправить уведомление пользователям'
)
async def send_notification(send_notification_data: SendNotificationData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = None
    if send_notification_data.send_all:
        q = select(User).where(User.role == UserRole.student)
    else:
        q = select(User).where(column('id').in_(send_notification_data.user_ids))
    
    users = session.exec(q).all()

    notifications = [Notification(user_id=user.id, title=send_notification_data.title, body=send_notification_data.body, created_at=datetime.utcnow()) for user in users]
    session.add_all(notifications)
    session.commit()
    return Message(msg='Уведомление отправлено')

@router.post(
    '/get_knowledge_posts',
    summary='Получить список постов с биржи знаний(на модерации)'
)
async def get_knowledge_posts(paged_request_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(KnowledgePost).where(KnowledgePost.status == ModerationStatus.on_moderation).limit(paged_request_data.limit).offset(paged_request_data.offset)
    posts = session.exec(q).all()
    return posts

@router.post(
    '/moderate_knowledge_post',
    summary='Установить статус поста с биржи знаний(одобрено/отклонено)'
)
async def moderate_knowledge_post(moderation_data: ModerationData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(KnowledgePost).where(KnowledgePost.id == moderation_data.id)
    post = session.exec(q).first()
    if not post or post.status != ModerationStatus.on_moderation:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пост не найден')
    
    post.status = moderation_data.new_status
    session.add(post)
    session.commit()

    return Message(msg='Данные сохранены')

