from pydantic import BaseModel
from typing import Optional
from models import UserRole
from datetime import datetime

class RegisterData(BaseModel):
    last_name: str
    first_name: str
    patronymic: Optional[str] = None
    student_id: int
    user_role: UserRole
    login: Optional[str] = None
    password: Optional[str] = None
    personal_rating: float = 0

class LoginAdminData(BaseModel):
    login: str
    password: str

class LoginData(BaseModel):
    last_name: str
    first_name: str
    student_id: int

class TokenData(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None

class UserData(BaseModel):
    id: int
    student_id: Optional[int] = None
    last_name: str
    first_name: str
    patronymic: Optional[str] = None
    role: UserRole
    team_id: Optional[int] = None
    is_captain: bool
    personal_rating: float
    is_blocked: bool
    login: Optional[str] = None
    created_at: datetime

class UserEditData(BaseModel):
    last_name: Optional[str]
    first_name: Optional[str]
    patronymic: Optional[str]

class AchievementData(BaseModel):
    user_id: int
    title: str
    description: str
    earned_at: datetime

class UserGetData(BaseModel):
    id: int

class ChangeCredentialsData(BaseModel):
    new_login: Optional[str] = None
    old_password: str
    new_password: Optional[str] = None

class NotificationData(BaseModel):
    id: int
    title: str
    body: str
    dismissed: bool
    created_at: datetime

class DismissNotificationData(BaseModel):
    id: int