from fastapi import APIRouter, Request, Depends, Security, Response, status, UploadFile, Form
from sqlmodel import Session, select, column
from database.session import get_session
from models import User, UserRole, File
from schemas.files import *
from schemas.common import *
from auth.auth_handler import access_security, refresh_security
from fastapi_jwt import JwtAuthorizationCredentials
from datetime import timedelta, datetime
from decouple import config
from urllib.parse import quote

router = APIRouter(
    prefix='/files',
    tags=['files'],
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

FILE_SIZE_LIMIT = 1024 * 1024 * 10 # 10MB

@router.post(
    '/upload',
    summary='Загрузить файл'
)
async def upload_file(file: UploadFile, response: Response, display_name: str = Form(default=None), credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    if file.size > FILE_SIZE_LIMIT:
        response.status_code = status.HTTP_413_CONTENT_TOO_LARGE
        return Message(msg='Размер файла не должен превышать 10МБ')

    file_data = await file.read()
    f = File(
        name=file.filename,
        data=file_data,
        display_name=display_name,
        author_id=user.id,
        created_at=datetime.utcnow()
    )
    session.add(f)
    session.commit()

    return FileData(id=f.id)

@router.post(
    '/get_info',
    summary='Получить информацию о файле'
)
async def get_info(file_data: FileData, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    q = select(File).where(File.id == file_data.id)
    file = session.exec(q).first()
    if not file:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Файл не найден')
    
    if (file.author_id != user.id) and (user.role != UserRole.content_manager):
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Недостаточно прав')
    
    return FileDescriptionData(
        id=file.id,
        name=file.name,
        display_name=file.display_name,
        size=len(file.data),
        author_id=file.author_id,
        created_at=file.created_at,
    )


@router.post(
    '/download/{file_id}',
    summary='Скачать файл'
)
async def download_file(file_id: int, response: Response, credentials: JwtAuthorizationCredentials = Security(access_security), session: Session = Depends(get_session)):
    q = select(User).where(User.id == credentials['id'])
    user = session.exec(q).first()
    if not user:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return Message(msg='Пользователь не найден')

    q = select(File).where(File.id == file_id)
    file = session.exec(q).first()
    if not file:
        response.status_code = status.HTTP_404_NOT_FOUND
        return Message(msg='Файл не найден')
    
    if (file.author_id != user.id) and (user.role != UserRole.content_manager):
        response.status_code = status.HTTP_403_FORBIDDEN
        return Message(msg='Недостаточно прав')
    
    filename = quote(file.name, safe='')
    headers = {
        'Content-Disposition': f'attachment; filename="attachment"; filename*=UTF-8\'\'{filename}'
    }

    return Response(
        content=file.data,
        media_type='application/octet-stream',
        headers=headers
    )