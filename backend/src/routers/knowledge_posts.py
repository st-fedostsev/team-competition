from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, KnowledgePost, Achievement, Notification, KnowledgePostWorkStatus, KnowledgePostResponse, KnowledgePostResponseStatus
from models.achievement_templates import ACHIEVEMENTS
from models.notification_templates import NOTIFICATIONS
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

    q = select(User).where(User.team_id == user.team_id)
    team_members = session.exec(q).all()

    achievement_type = ACHIEVEMENTS['brave_novice'] if post_create_data.type == KnowledgePostType.request else ACHIEVEMENTS['instructor']
    for member in team_members:
        Achievement.give(session, member.id, achievement_type)

    Notification.send(session, user.id, NOTIFICATIONS['post_created'])

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
    
    q = select(KnowledgePost).where((KnowledgePost.status == ModerationStatus.approved) & (KnowledgePost.work_status == KnowledgePostWorkStatus.awaiting))
    posts = session.exec(q.limit(post_list_data.limit).offset(post_list_data.offset)).all()
    posts_all = session.exec(q).all()

    result = list(map(lambda x: KnowledgePostData(
            id=x.id,
            team_id=x.team_id,
            type=x.type,
            title=x.title,
            description=x.description,
            tags=x.tags,
            status=x.status,
            work_status=x.work_status
        ), 
        posts
    ))
    
    return {
        'count': len(posts_all),
        'result': result
    }

@router.post(
    '/list_my',
    summary='Получить объявления своей команды'
)
async def list_my_posts(post_list_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')

    q = select(KnowledgePost).where((KnowledgePost.team_id == user.team_id) & (KnowledgePost.status == ModerationStatus.approved))
    posts = session.exec(q.limit(post_list_data.limit).offset(post_list_data.offset)).all()
    posts_all = session.exec(q).all()

    result = list(map(lambda x: KnowledgePostData(
            id=x.id,
            team_id=x.team_id,
            type=x.type,
            title=x.title,
            description=x.description,
            tags=x.tags,
            status=x.status,
            work_status=x.work_status
        ), 
        posts
    ))
    
    return {
        'count': len(posts_all),
        'result': result
    }


@router.post(
    '/list_other',
    summary='Получить чужие объявления'
)
async def list_other_posts(post_list_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')

    q = select(KnowledgePost).where((KnowledgePost.team_id != user.team_id) & (KnowledgePost.status == ModerationStatus.approved) & (KnowledgePost.work_status == KnowledgePostWorkStatus.awaiting))
    posts = session.exec(q.limit(post_list_data.limit).offset(post_list_data.offset)).all()
    posts_all = session.exec(q).all()

    result = list(map(lambda x: KnowledgePostData(
            id=x.id,
            team_id=x.team_id,
            type=x.type,
            title=x.title,
            description=x.description,
            tags=x.tags,
            status=x.status,
            work_status=x.work_status
        ), 
        posts
    ))
    
    return {
        'count': len(posts_all),
        'result': result
    }

@router.post(
    '/respond',
    summary='Откликнуться на объявление'
)
async def respond_to_post(knowledge_post_id_data: KnowledgePostIdData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')
    
    q = (select(KnowledgePost).where((KnowledgePost.team_id != user.team_id) & 
                                (KnowledgePost.status == ModerationStatus.approved) & 
                                (KnowledgePost.work_status == KnowledgePostWorkStatus.awaiting) & 
                                (KnowledgePost.id == knowledge_post_id_data.id)))
    post = session.exec(q).first()
    if not post:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Объявление не найдено или принадлежит вам')

    q = select(KnowledgePostResponse).where((KnowledgePostResponse.from_team_id == user.team_id) & (KnowledgePostResponse.knowledge_post_id == post.id))
    existing_response = session.exec(q).first()
    if existing_response is not None:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Вы не можете откликнуться больше одного раза')

    post_response = KnowledgePostResponse(
        from_team_id=user.team_id,
        knowledge_post_id=post.id
    )
    session.add(post_response)
    session.commit()

    return Message(msg='Вы откликнулись на объявление')

@router.post(
    '/get_responses',
    summary='Получить отклики на объявление'
)
async def post_get_responses(paged_request_id_data: PagedRequestIdData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')
    
    q = select(KnowledgePost).where(KnowledgePost.id == paged_request_id_data.id)
    post = session.exec(q).first()
    if not post:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Объявление не найдено')
    
    if post.team_id != user.team_id:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')

    q = select(KnowledgePostResponse).where(KnowledgePostResponse.knowledge_post_id == paged_request_id_data.id)
    post_responses = session.exec(q).all()
    
    return {
        'count': len(post_responses),
        'result': post_responses[paged_request_id_data.offset:paged_request_id_data.offset + paged_request_id_data.limit]
    }

@router.post(
    '/get_my_responses',
    summary='Получить свои отклики на объявление'
)
async def post_get_my_responses(paged_request_id_data: PagedRequestIdData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')
    
    q = select(KnowledgePost).where(KnowledgePost.id == paged_request_id_data.id)
    post = session.exec(q).first()
    if not post:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Объявление не найдено')

    q = select(KnowledgePostResponse).where((KnowledgePostResponse.knowledge_post_id == paged_request_id_data.id) & (KnowledgePostResponse.from_team_id == user.team_id))
    post_responses = session.exec(q).all()
    
    return {
        'count': len(post_responses),
        'result': post_responses[paged_request_id_data.offset:paged_request_id_data.offset + paged_request_id_data.limit]
    }
    
@router.post(
    '/approve_response',
    summary='Одобрить отклик на объявление'
)
async def approve_post_response(approve_post_response_data: ApprovePostResponseData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')
    
    q = select(KnowledgePostResponse).where(KnowledgePostResponse.id == approve_post_response_data.id)
    post_response = session.exec(q).first()
    if not post_response:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Отклик не найден')

    q = select(KnowledgePost).where(KnowledgePost.id == post_response.knowledge_post_id)
    post = session.exec(q).first()
    if not post:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Объявление не найдено')
    
    if post.team_id != user.team_id:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')

    q = select(KnowledgePostResponse).where(KnowledgePostResponse.knowledge_post_id == post_response.knowledge_post_id)
    other_responses = session.exec(q).all()
    for resp in other_responses:
        if resp.id == post_response.id:
            continue
        resp.status = KnowledgePostResponseStatus.rejected

    post_response.status = KnowledgePostResponseStatus.approved
    post.work_status = KnowledgePostWorkStatus.in_work
    session.add(post_response)
    session.add(post)
    session.add_all(other_responses)
    session.commit()

    return Message(msg='Отклик принят')

@router.post(
    '/send_report',
    summary='Отправить отчет по отклику'
)
async def send_response_report(send_response_report_data: SendResponseReportData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')
    
    q = select(KnowledgePostResponse).where(KnowledgePostResponse.id == send_response_report_data.response_id)
    post_response = session.exec(q).first()
    if not post_response:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Отклик не найден')
    
    q = select(KnowledgePost).where(KnowledgePost.id == post_response.knowledge_post_id)
    post = session.exec(q).first()
    if not post:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Объявление не найдено')
    
    if post.work_status == KnowledgePostWorkStatus.complete:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Отчет уже отправлен')
    
    report_team_id = user.team_id if post.type == KnowledgePostType.request else post.team_id
    if user.team_id != report_team_id:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Отчет доступен к загрузке команде, нуждающейся в помощи')
    
    post_response.response_file_url = send_response_report_data.file_url
    post_response.response_comment = send_response_report_data.comment
    post.work_status = KnowledgePostWorkStatus.complete
    session.add_all([post_response, post])
    session.commit()

    return Message(msg='Отчет отправлен')

@router.get(
    '/get_report_for/{post_id}',
    summary='Получить отчет для объявления'
)
async def get_report_for(post_id: int, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в команде')
    
    q = select(KnowledgePost).where(KnowledgePost.id == post_id)
    post = session.exec(q).first()
    if not post:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Объявление не найдено')
    
    
    q = select(KnowledgePostResponse).where((KnowledgePostResponse.knowledge_post_id == post_id) & (KnowledgePostResponse.status == KnowledgePostResponseStatus.approved))
    post_response = session.exec(q).first()
    if not post_response:
        if user.team_id != post.team_id:
            response.status_code = status.HTTP_403_FORBIDDEN
            return Message(msg='Доступ запрещен')

        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Нет готовых отчетов')
    
    if user.team_id not in [post.team_id, post_response.from_team_id]:
        response.status_code = status.HTTP_403_FORBIDDEN
        return MessagE(msg='Доступ запрещен')
    
    return post_response
