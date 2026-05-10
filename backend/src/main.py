from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, delete, and_
from database.session import init_database, get_session_cm
from models import *
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from routers import users, team
from pwdlib import PasswordHash

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

async def populate_defaults():
    with get_session_cm() as session:
        q = select(User).where(User.login == 'admin')
        user = session.exec(q).first()
        if user is None:
            pwd_context = PasswordHash.recommended()
            with get_session_cm() as session:
                user = User(
                    student_id=0,
                    last_name='',
                    first_name='Администратор',
                    patronymic='',
                    role=UserRole.admin,
                    login='admin',
                    password_hash=pwd_context.hash('admin'),
                    created_at=datetime.now()
                )
                session.add(user)
                session.commit()
        print('Admin account created')

@app.on_event('startup')
async def on_startup():
    init_database()
    await populate_defaults()