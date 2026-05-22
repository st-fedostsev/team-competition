from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, KnowledgePost
from schemas.knowledge_posts import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/knowledge_posts',
    tags=['knowledge_posts'],
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
    summary='Создать объявление на бирже знаний'
)
async def create_post(post_create_data: KnowledgePostCreateData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь должен состоять в команде')

    post = KnowledgePost(
        team_id=user.team_id,
        type=post_create_data.type,
        title=post_create_data.title,
        description=post_create_data.description,
        tags=post_create_data.tags
    )
    session.add(post)
    session.commit()

    return Message(msg='Объявление создано')

@router.post(
    '/list',
    summary='Получить список объявлений'
)
async def list_posts(post_list_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(KnowledgePost).limit(post_list_data.limit).offset(post_list_data.offset)
    posts = session.exec(q).all()

    result = list(map(lambda x: KnowledgePostData(
            id=x.id,
            team_id=x.team_id,
            type=x.type,
            title=x.title,
            description=x.description,
            tags=x.tags,
            status=x.status
        ), 
        posts
    ))
    
    return result