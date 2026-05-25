from fastapi import FastAPI, Security, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, delete, and_
from database.session import init_database, get_session_cm
from models import *
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from routers import users, team, technical_admin, events, knowledge_posts, challenges, news, content_manager
from pwdlib import PasswordHash
from fastapi_jwt import JwtAuthorizationCredentials
from auth.auth_handler import access_security, refresh_security
from middlewares.auth import AuthMiddleware
from middlewares.ban import BanMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)
app.include_router(users.router)
app.include_router(team.router)
app.include_router(events.router)
app.include_router(challenges.router)
app.include_router(news.router)
app.include_router(knowledge_posts.router)
app.include_router(technical_admin.router)
app.include_router(content_manager.router)

app.add_middleware(BanMiddleware)
app.add_middleware(AuthMiddleware)

async def populate_defaults():
    with get_session_cm() as session:
        q = select(User).where(User.role == UserRole.technical_admin)
        user = session.exec(q).first()
        if user is None:
            pwd_context = PasswordHash.recommended()
            with get_session_cm() as session:
                user = User(
                    student_id=0,
                    last_name='',
                    first_name='Администратор',
                    patronymic='',
                    role=UserRole.technical_admin,
                    login='admin',
                    password_hash=pwd_context.hash('admin'),
                    created_at=datetime.utcnow()
                )
                session.add(user)
                session.commit()
            print('Admin account created')

@app.on_event('startup')
async def on_startup():
    init_database()
    await populate_defaults()