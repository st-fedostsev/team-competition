from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, Team, Achievement
from models.achievement_templates import ACHIEVEMENTS
from schemas.game_admin import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/game_admin',
    tags=['game_admin'],
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
    '/add_user_to_team',
    summary='Добавить пользователя в команду(в т.ч. переместить пользователя из одной команды в другую)'
)
async def add_user_to_team(add_user_to_team_data: AddUserToTeamData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.game_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')

    q = select(Team).where(Team.id == add_user_to_team_data.team_id)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Команда не найдена')
    
    q = select(User).where((User.id == add_user_to_team_data.user_id) & (User.role == UserRole.student))
    target_user = session.exec(q).first()
    if not target_user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Пользователь не найден')
    
    target_user.team_id = team.id
    session.add(target_user)
    session.commit()

    return Message(msg='Пользователь добавлен в команду')

@router.post(
    '/kick_user_from_team',
    summary='Исключить пользователя из команды, в которой он состоит'
)
async def kick_user_from_team(kick_user_from_team_data: KickUserFromTeamData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.game_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(User).where((User.id == kick_user_from_team_data.user_id) & (User.role == UserRole.student))
    target_user = session.exec(q).first()
    if not target_user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Пользователь не найден')
    
    target_user.team_id = None
    session.add(target_user)
    session.commit()

    return Message(msg='Пользователь исключен из команды')

@router.post(
    '/disband_team',
    summary='Расформировать команду'
)
async def disband_team(disband_team_data: DisbandTeamData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.game_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(Team).where(Team.id == disband_team_data.id)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Команда не найдена')
    
    q = select(User).where(User.team_id == team.id)
    team_members = session.exec(q).all()

    for member in team_members:
        member.team_id = None
        member.is_captain = False
    
    session.add_all(team_members)
    session.delete(team)
    session.commit()

    return Message(msg='Команда расформирована')

@router.post(
    '/edit_personal_rating',
    summary='Редактировать личный рейтинг'
)
async def edit_personal_rating(edit_personal_rating_data: EditPersonalRatingData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.game_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Доступ запрещен')
    
    q = select(User).where(User.id == edit_personal_rating_data.id)
    target_user = session.exec(q).first()
    if not target_user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Пользователь не найден')
    
    target_user.personal_rating = edit_personal_rating_data.new_rating
    session.add(target_user)
    session.commit()

    return Message(msg='Данные сохранены')