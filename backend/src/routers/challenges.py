from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, Challenge, ChallengeReport
from schemas.challenges import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/challenges',
    tags=['challenges'],
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
    summary='Создать челлендж'
)
async def create_challenge(challenge_create_data: ChallengeCreateData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    if user.role != UserRole.content_manager:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')

    challenge = Challenge(
        title=challenge_create_data.title,
        description=challenge_create_data.description,
        deadline=challenge_create_data.deadline,
        created_by=user.id,
        is_active=True
    )
    session.add(challenge)
    session.commit()

    return Message(msg='Челлендж создан')

@router.post(
    '/list',
    summary='Получить список челленджей'
)
async def list_challenges(challenge_list_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(Challenge)
    challenges = session.exec(q.limit(challenge_list_data.limit).offset(challenge_list_data.offset)).all()
    challenges_all = session.exec(q).all()

    now = datetime.utcnow()
    for challenge in challenges:
        if now > challenge.deadline:
            challenge.is_active = False
        
    session.add_all(challenges)
    session.commit()

    result = list(map(lambda x: ChallengeData(
            id=x.id,
            title=x.title,
            description=x.description,
            deadline=x.deadline,
            created_by=x.created_by,
            is_active=x.is_active
        ), 
        challenges
    ))
    
    return {
        'count': len(challenges_all),
        'result': result
    }

@router.post(
    '/send_report',
    summary='Отправить отчет по челленджу'
)
async def send_report(challenge_report_data: ChallengeReportData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    if not user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь должен состоять в команде')
    
    q = select(Challenge).where(Challenge.id == challenge_report_data.challenge_id)
    challenge = session.exec(q).first()

    if not challenge:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Челлендж не найден')

    challenge = ChallengeReport(
        challenge_id=challenge_report_data.challenge_id,
        team_id=user.team_id,
        file_url=challenge_report_data.file_url,
        comment=challenge_report_data.comment
    )

    session.add(challenge)
    session.commit()

    return Message(msg='Отчет отправлен')