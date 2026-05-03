from pydantic import BaseModel
from typing import Optional
from models import UserRole

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