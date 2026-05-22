from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, Team, Achievement
from models.achievement_templates import ACHIEVEMENTS
from schemas.team import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/team',
    tags=['team'],
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
    summary='Создать команду'
)
async def create_team(team_create_data: TeamCreateData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    if user.team_id is not None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return Message(msg='Пользователь уже состоит в команде')

    team = Team(
        name=team_create_data.name,
        captain_id=user.id,
        created_at=datetime.now()
    )
    session.add(team)
    session.commit()
    user.team_id = team.id
    user.is_captain = True
    session.add(user)
    session.commit()

    Achievement.give(session, user.id, ACHIEVEMENTS['my_first_team'])

    return Message(msg='Команда создана')

@router.get(
    '/get_my',
    summary='Получить информацию о своей команде'
)
async def get_my_team(response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(Team).where(Team.id == user.team_id)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Команда не найдена')
    
    result = TeamData(
        id=team.id,
        name=team.name,
        crc=team.crc,
        league=team.league,
        captain_id=team.captain_id,
        created_at=team.created_at
    )
    if user.is_captain:
        result.secret_code = team.secret_code
    
    return result

@router.post(
    '/regenerate_code',
    summary='Сгенерировать новый код приглашения(доступно только капитану)'
)
async def regenerate_code_team(response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.is_captain:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return Message(msg='Пользователь не является капитаном')

    q = select(Team).where(Team.id == user.team_id)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Команда не найдена')
    
    team.secret_code = uuid.uuid4()
    session.add(team)
    session.commit()
    return Message(msg='Код успешно изменен')

@router.post(
    '/leave',
    summary='Выйти из команды'
)
async def leave_team(response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):    
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if user.team_id is None:
        return Message(msg='Пользователь не состоит в команде')

    q = select(User).where(User.team_id == user.team_id)
    members_count = len(session.exec(q).all())

    if user.is_captain:
        if members_count > 1:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return Message(msg='Капитан не может покинуть свою команду, пока в ней есть другие участники')
        
        q = select(Team).where(Team.id == user.team_id)
        team = session.exec(q).first()
        if team:
            session.delete(team)

    user.team_id = None
    user.is_captain = False
    session.add(user)
    session.commit()
    return Message(msg='Вы успешно вышли из команды')

@router.post(
    '/join',
    summary='Присоединиться к команде'
)
async def join_team(join_team_data: JoinTeamData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if user.team_id is not None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return Message(msg='Вы уже состоите в команде')
    
    q = select(Team).where(Team.secret_code == join_team_data.secret_code)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Команда не найдена')
    
    user.team_id = team.id
    session.add(user)
    session.commit()

    Achievement.give(session, user.id, ACHIEVEMENTS['my_first_team'])

    return Message(msg='Вы успешно присоединились к команде')

@router.post(
    '/search',
    summary='Поиск команды'
)
async def search_team(search_team_data: SearchTeamData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):

    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    q = select(Team).filter(column('name').icontains(search_team_data.query)).limit(search_team_data.limit).offset(search_team_data.offset)
    teams = session.exec(q).all()
    
    result = list(map(lambda x: TeamData(
                id=x.id,
                name=x.name,
                crc=x.crc,
                league=x.league,
                captain_id=x.captain_id,
                created_at=x.created_at,
                secret_code=None
            ),
            teams
        )
    )
    return result

@router.post(
    '/leaderboard',
    summary='Получить лидерборд рейтингов команд'
)
async def user_get_leaderboard(paged_request_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = (select(Team).order_by(-Team.crc)
                    .limit(paged_request_data.limit)
                    .offset(paged_request_data.offset))
    result = session.exec(q).all()
    result = list(map(lambda x: TeamData(
                id=x.id,
                name=x.name,
                crc=x.crc,
                league=x.league,
                captain_id=x.captain_id,
                created_at=x.created_at,
                secret_code=None
            ),
            result
        )
    )
    return result