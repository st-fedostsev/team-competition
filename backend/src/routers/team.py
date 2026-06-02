from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, Team, Achievement, get_league_by_partial_name, JoinTeamRequest, RequestStatus, Notification
from models.achievement_templates import ACHIEVEMENTS
from models.notification_templates import NOTIFICATIONS
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
        created_at=datetime.utcnow()
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
    
    team.update_crc(session)

    q = select(User).where(User.team_id == team.id)
    members = session.exec(q).all()

    members_ids = list(map(lambda x: x.id, members))

    result = TeamData(
        id=team.id,
        name=team.name,
        crc=team.crc,
        league=team.league,
        captain_id=team.captain_id,
        created_at=team.created_at,
        members=members_ids
    )
    if user.is_captain:
        result.secret_code = team.secret_code
    
    return result

@router.post(
    '/get_by_id',
    summary='Получить команду по id'
)
async def get_team_by_id(get_team_by_id_data: GetTeamByIdData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(Team).where(Team.id == get_team_by_id_data.id)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Команда не найдена')
    
    q = select(User).where(User.team_id == team.id)
    members = session.exec(q).all()
    members_ids = list(map(lambda x: x.id, members))

    return TeamData(
        id=team.id,
        name=team.name,
        crc=team.crc,
        league=team.league,
        captain_id=team.captain_id,
        created_at=team.created_at,
        members=members_ids
    )

@router.post(
    '/get_by_code',
    summary='Получить команду по секретному коду'
)
async def get_team_by_code(get_team_by_code_data: GetTeamByCodeData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(Team).where(Team.secret_code == get_team_by_code_data.secret_code)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Команда не найдена')
    
    q = select(User).where(User.team_id == team.id)
    members = session.exec(q).all()
    members_ids = list(map(lambda x: x.id, members))

    return TeamData(
        id=team.id,
        name=team.name,
        crc=team.crc,
        league=team.league,
        captain_id=team.captain_id,
        created_at=team.created_at,
        members=members_ids
    )

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


    result = []
    for team in teams:
        q = select(User).where(User.team_id == team.id)
        members = session.exec(q).all()
        members_ids = list(map(lambda x: x.id, members))

        result.append(TeamData(
                        id=team.id,
                        name=team.name,
                        crc=team.crc,
                        league=team.league,
                        captain_id=team.captain_id,
                        created_at=team.created_at,
                        secret_code=None,
                        members=members_ids
                    ))

    return result

@router.post(
    '/leaderboard',
    summary='Получить лидерборд рейтингов команд'
)
async def team_get_leaderboard(paged_request_query_data: PagedRequestQueryData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = (select(Team).where(column('name').ilike(f'%{paged_request_query_data.query}%'))
                    .order_by(-Team.crc))
    teams = session.exec(q).all()

    result = []
    for team in teams:
        q = select(User).where(User.team_id == team.id)
        members = session.exec(q).all()
        members_ids = list(map(lambda x: x.id, members))

        result.append(TeamData(
                        id=team.id,
                        name=team.name,
                        crc=team.crc,
                        league=team.league,
                        captain_id=team.captain_id,
                        created_at=team.created_at,
                        secret_code=None,
                        members=members_ids
                    ))
    
    if len(paged_request_query_data.query) > 0:
        league = get_league_by_partial_name(paged_request_query_data.query)
        if league is not None:
            q = select(Team).where(Team.league == league)
            teams = session.exec(q).all()
            for team in teams:
                q = select(User).where(User.team_id == team.id)
                members = session.exec(q).all()
                members_ids = list(map(lambda x: x.id, members))
                data = TeamData(
                            id=team.id,
                            name=team.name,
                            crc=team.crc,
                            league=team.league,
                            captain_id=team.captain_id,
                            created_at=team.created_at,
                            secret_code=None,
                            members=members_ids
                        )
                if data not in result:
                    result.append(data)

    return result

@router.post(
    '/kick',
    summary='Исключить пользователя из команды'
)
async def kick_user(kick_user_data: KickUserData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.is_captain:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Недостаточно прав')
    
    q = select(Team).where(Team.id == user.team_id)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Команда не найдена')
    
    q = select(User).where(User.id == kick_user_data.id)
    target_user = session.exec(q).first()
    if not target_user:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не найден')
    
    if target_user.team_id != user.team_id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Пользователь не состоит в вашей команде')
    
    if target_user.id == user.id:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Нельзя исключить самого себя')

    target_user.team_id = None
    target_user.is_captain = False

    session.add(target_user)
    session.commit()

    Notification.send(session, target_user.id, NOTIFICATIONS['kicked'])

    return Message(msg='Пользователь исключен из команды')

@router.post(
    '/request_join',
    summary='Отправить запрос на вступление'
)
async def request_join(request_join_data: RequestJoinData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if user.team_id is not None:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Вы уже состоите в команде')
    
    q = select(Team).where(Team.id == request_join_data.id)
    team = session.exec(q).first()
    if not team:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Команда не найдена')
    
    q = select(User).where(User.id == Team.captain_id)
    captain = session.exec(q).first()
    if not captain:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Капитан не найден')
    
    q = select(JoinTeamRequest).where((JoinTeamRequest.from_id == user.id) & (JoinTeamRequest.status == RequestStatus.awaiting))
    requests = session.exec(q).all()
    if len(requests) > 0:
        response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
        return Message(msg='Одновременно можно отправить только одну заявку')

    request = JoinTeamRequest(
        team_id=team.id,
        from_id=user.id,
        created_at=datetime.utcnow()
    )

    session.add(request)
    session.commit()

    Notification.send(session, captain.id, NOTIFICATIONS['join_request'])

    return Message(msg='Заявка отправлена')

@router.post(
    '/cancel_request',
    summary='Отменить текущую заявку'
)
async def cancel_request(response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(JoinTeamRequest).where((JoinTeamRequest.from_id == user.id) & (JoinTeamRequest.status == RequestStatus.awaiting))
    request = session.exec(q).first()
    if not request:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Заявок не найдено')
    
    session.delete(request)
    session.commit()

    return Message(msg='Заявка отменена')

@router.post(
    '/get_my_requests',
    summary='Получить отправленные заявки'
)
async def get_my_requests(paged_request_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = (select(JoinTeamRequest).where(JoinTeamRequest.from_id == user.id)
                                .limit(paged_request_data.limit)
                                .offset(paged_request_data.offset))
    request = session.exec(q).all()
    return request

@router.get(
    '/get_requests',
    summary='Получить заявки на вступление в команду'
)
async def get_requests(response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.is_captain:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Заявки доступны к просмотру только капитану команды')

    q = select(JoinTeamRequest).where(JoinTeamRequest.team_id == user.team_id)
    requests = session.exec(q).all()
    return requests

@router.post(
    '/review_request',
    summary='Рассмотреть заявку на вступление в команду'
)
async def review_request(request_review_data: RequestReviewData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if not user.is_captain:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Заявки доступны к просмотру только капитану команды')
    
    q = select(JoinTeamRequest).where((JoinTeamRequest.id == request_review_data.id) & (JoinTeamRequest.team_id == user.team_id) & (JoinTeamRequest.status == RequestStatus.awaiting))
    request = session.exec(q).first()
    if not request:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Запрос не найден')
    
    request.status = request_review_data.new_status
    session.add(request)
    if request.status == RequestStatus.approved:
        q = select(User).where(User.id == request.from_id)
        from_user = session.exec(q).first()
        if from_user:
            if from_user.team_id is not None:
                response.status_code = status.HTTP_422_UNPROCESSABLE_CONTENT
                session.commit()
                return Message(msg='Пользователь уже состоит в команде')
            from_user.team_id = request.team_id
            session.add(from_user)

            if request_review_data.new_status == RequestStatus.approved:
                Notification.send(session, from_user.id, NOTIFICATIONS['request_approved'])
            else:
                Notification.send(session, from_user.id, NOTIFICATIONS['request_rejected'])
        
    session.commit()

    return Message(msg='Статус заявки изменен')