from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, Event, Achievement, Notification
from models.achievement_templates import ACHIEVEMENTS
from models.notification_templates import NOTIFICATIONS
from schemas.events import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/events',
    tags=['events'],
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


@router.post(
    '/create',
    summary='Создать мероприятие'
)
async def create_event(event_create_data: EventCreateData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    event = Event(
        title=event_create_data.title,
        description=event_create_data.description,
        date=event_create_data.date,
        format=event_create_data.format,
        created_by=user.id,
        is_official=event_create_data.is_official
    )
    session.add(event)
    session.commit()

    q = select(Event).where(Event.created_by == user.id)
    events = session.exec(q).all()
    if len(events) >= 2:
        Achievement.give(session, user.id, ACHIEVEMENTS['event_master'])
    
    Notification.send(session, user.id, NOTIFICATIONS['event_created'])

    return Message(msg='Мероприятие создано')

@router.post(
    '/list',
    summary='Получить список мероприятий'
)
async def list_events(event_list_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(Event)
    events = session.exec(q.limit(event_list_data.limit).offset(event_list_data.offset)).all()
    events_all = session.exec(q).all()

    result = list(map(lambda x: EventData(
            id=x.id,
            title=x.title,
            description=x.description,
            date=x.date,
            format=x.format,
            created_by=x.created_by,
            is_official=x.is_official
        ), 
        events
    ))
    
    return {
        'count': len(events_all),
        'result': result
    }