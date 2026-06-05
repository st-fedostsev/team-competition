from fastapi import APIRouter, Request, Depends, Security, Response, status, UploadFile
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, Notification, KnowledgePost, ModerationStatus, \
                    ChallengeReport, Achievement, Event
from models.achievement_templates import ACHIEVEMENTS
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
    
    q = select(KnowledgePost).where(KnowledgePost.status == ModerationStatus.on_moderation)
    posts = session.exec(q.limit(paged_request_data.limit).offset(paged_request_data.offset)).all()
    posts_all = session.exec(q).all()
    return {
        'count': len(posts_all),
        'result': posts
    }

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

@router.post(
    '/get_challenge_reports',
    summary='Получить список отчетов по челленджам'
)
async def get_challenge_reports(paged_request_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(ChallengeReport).where(ChallengeReport.status == ModerationStatus.on_moderation)
    reports = session.exec(q.limit(paged_request_data.limit).offset(paged_request_data.offset)).all()
    reports_all = session.exec(q).all()
    return {
        'count': len(reports_all),
        'result': reports
    }

@router.post(
    '/moderate_challenge_report',
    summary='Установить статус отчета по челленджу(одобрено/отклонено)'
)
async def moderate_challenge_report(moderation_data: CommentModerationData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(ChallengeReport).where(ChallengeReport.id == moderation_data.id)
    report = session.exec(q).first()
    if not report or report.status != ModerationStatus.on_moderation:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пост не найден')
    
    report.status = moderation_data.new_status
    if moderation_data.moderation_comment is not None:
        report.moderation_comment = moderation_data.moderation_comment
    session.add(report)
    session.commit()

    q = select(ChallengeReport).where((ChallengeReport.team_id == report.team_id) & (ChallengeReport.status == ModerationStatus.approved))
    team_reports = session.exec(q).all()
    if len(team_reports) >= 3:
        q = select(User).where(User.team_id == report.team_id)
        team_members = session.exec(q).all()
        for member in team_members:
            Achievement.give(session, member.id, ACHIEVEMENTS['beginning_of_the_path'])

    return Message(msg='Данные сохранены')


@router.post(
    '/get_events',
    summary='Получить список мероприятий'
)
async def get_challenge_reports(paged_request_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(Event).where(Event.status == ModerationStatus.on_moderation)
    events = session.exec(q.limit(paged_request_data.limit).offset(paged_request_data.offset)).all()
    events_all = session.exec(q).all()
    return {
        'count': len(events_all),
        'result': events
    }

@router.post(
    '/moderate_event',
    summary='Установить статус мероприятия(одобрено/отклонено)'
)
async def moderate_event(moderation_data: CommentModerationData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(Event).where(Event.id == moderation_data.id)
    event = session.exec(q).first()
    if not event or event.status != ModerationStatus.on_moderation:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Мероприятие не найдено')
    
    event.status = moderation_data.new_status
    session.add(event)
    session.commit()

    q = select(Event).where((Event.created_by == event.created_by) & (Event.status == ModerationStatus.approved))
    events = session.exec(q).all()
    if len(events) >= 2:
        Achievement.give(session, event.created_by, ACHIEVEMENTS['beginning_of_the_path'])

    return Message(msg='Данные сохранены')

