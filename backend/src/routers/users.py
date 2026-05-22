from fastapi import APIRouter, Request, Depends, Security, Response, status
from sqlmodel import Session, select
from database.session import get_session
from models import User, UserRole, Achievement
from pwdlib import PasswordHash
from schemas.users import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config

router = APIRouter(
    prefix='/users',
    tags=['users'],
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
    '/login_admin',
    summary='Аутентификация'
)
async def login_admin(login_data: LoginAdminData, session: Session = Depends(get_session)):
    q = select(User).where(User.login == login_data.login)
    user = session.exec(q).first()
    if user is None:
        return Message(msg='Неверный логин или пароль')

    if not pwd_context.verify(login_data.password, user.password_hash):
        return Message(msg='Неверный логин или пароль')
    
    subject = {
        'id': user.id,
        'role': user.role
    }
    access_token = access_security.create_access_token(subject=subject)
    refresh_token = refresh_security.create_refresh_token(subject=subject)
    return TokenData(
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.post(
    '/login',
    summary='Аутентификация'
)
async def login_user(login_data: LoginData, session: Session = Depends(get_session)):
    q = select(User).where(
        (User.first_name == login_data.first_name) &
        (User.last_name == login_data.last_name) &
        (User.student_id == login_data.student_id) &
        (~User.role.in_([UserRole.admin, UserRole.technical_admin]))
    )
    user = session.exec(q).first()
    if user is None:
        return Message(msg='Неверные данные')
    
    subject = {
        'id': user.id,
        'role': user.role
    }
    access_token = access_security.create_access_token(subject=subject)
    refresh_token = refresh_security.create_refresh_token(subject=subject)
    return TokenData(
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.post(
    '/refresh',
    summary='Обновления JWT токена'
)
async def refresh_token(credentials: JwtAuthorizationCredentials = Security(refresh_security)):
    access_token = access_security.create_access_token(subject=credentials.subject)
    refresh_token = refresh_security.create_refresh_token(subject=credentials.subject, expires_delta=timedelta(days=2))
    return TokenData(
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.post(
    '/register',
    summary='Регистрация пользователя(вызывается администратором)'
)
async def register_user(register_data: RegisterData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    if credentials['role'] != UserRole.technical_admin:
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Недостаточно прав для выполнения запроса')

    if register_data.user_role in (UserRole.admin, UserRole.technical_admin):
        user = User(
            student_id=0,
            last_name=register_data.last_name,
            first_name=register_data.first_name,
            patronymic=register_data.patronymic,
            role=register_data.user_role,
            created_at=datetime.now(),
            login=register_data.login,
            password_hash=pwd_context.hash(register_data.password)
        )
    else:
        user = User(
            student_id=register_data.student_id,
            last_name=register_data.last_name,
            first_name=register_data.first_name,
            patronymic=register_data.patronymic,
            role=register_data.user_role,
            created_at=datetime.now()
        )

    session.add(user)
    session.commit()

    return Message(msg='Пользователь успешно зарегистрирован')

@router.get(
    '/me',
    summary='Получить данные своего профиля'
)
async def user_me(response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    return UserData(
        id=user.id,
        student_id=user.student_id,
        last_name=user.last_name,
        first_name=user.first_name,
        patronymic=user.patronymic,
        role=user.role,
        team_id=user.team_id,
        is_captain=user.is_captain,
        personal_rating=user.personal_rating,
        is_blocked=user.is_blocked,
        login=user.login,
        created_at=user.created_at
    )

@router.post(
    '/edit',
    summary='Редактировать профиль'
)
async def user_edit(user_edit_data: UserEditData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    if user_edit_data.last_name is not None:
        user.last_name = user_edit_data.last_name
    if user_edit_data.first_name is not None:
        user.first_name = user_edit_data.first_name
    if user_edit_data.patronymic is not None:
        user.patronymic = user_edit_data.patronymic
    
    session.add(user)
    session.commit()
    return Message(msg='Данные сохранены')

@router.post(
    '/leaderboard',
    summary='Получить лидерборд рейтингов пользователей'
)
async def user_get_leaderboard(paged_request_data: PagedRequestData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = (select(User).where(User.role == UserRole.student)
                    .order_by(-User.personal_rating)
                    .limit(paged_request_data.limit)
                    .offset(paged_request_data.offset))
    result = session.exec(q).all()
    result = list(map(lambda x: UserData(
                id=x.id,
                last_name=x.last_name,
                first_name=x.first_name,
                patronymic=x.patronymic,
                role=x.role,
                team_id=x.team_id,
                is_captain=x.is_captain,
                personal_rating=x.personal_rating,
                is_blocked=x.is_blocked,
                created_at=x.created_at
            ),
            result
        )
    )
    return result

@router.get(
    '/my_achievements',
    summary='Получить список своих достижений'
)
async def my_achievements(response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')
    
    q = select(Achievement).where(Achievement.user_id == user.id)
    achievements = session.exec(q).all()

    result = list(map(lambda x: AchievementData(
            id=x.id,
            user_id=x.user_id,
            title=x.title,
            description=x.description,
            earned_at=x.earned_at
        ), 
        achievements
    ))

    return result