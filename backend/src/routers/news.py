from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, News
from schemas.news import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/news',
    tags=['news'],
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
    summary='Создать новость'
)
async def create_news(news_create_data: NewsCreateData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    if user.role != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Недостаточно прав')

    news = News(
        title=news_create_data.title,
        body=news_create_data.body,
        created_at=datetime.utcnow(),
        created_by=user.id
    )
    session.add(news)
    session.commit()

    return Message(msg='Новость создана')

@router.post(
    '/list',
    summary='Получить список новостей'
)
async def list_news(news_list_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(News).limit(news_list_data.limit).offset(news_list_data.offset)
    news = session.exec(q).all()

    result = list(map(lambda x: NewsData(
            id=x.id,
            title=x.title,
            body=x.body,
            created_at=x.created_at,
            created_by=x.created_by
        ), 
        news
    ))
    
    return result