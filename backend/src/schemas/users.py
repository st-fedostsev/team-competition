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
    student_id: int
    last_name: str
    first_name: str
    patronymic: str | None = None
    role: UserRole
    team_id: int | None = None
    is_captain: bool
    personal_rating: float
    is_blocked: bool
    login: str | None = None
    created_at: datetime

class UserEditData(BaseModel):
    last_name: Optional[str]
    first_name: Optional[str]
    patronymic: Optional[str]