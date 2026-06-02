from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    student = 'student'
    content_manager = 'content_manager'
    game_admin = 'game_admin'
    technical_admin = 'technical_admin'

class User(SQLModel, table=True):
    __tablename__ = 'users'
    id: int = Field(primary_key=True)
    student_id: int = Field()
    last_name: str = Field()
    first_name: str = Field()
    patronymic: str | None = None
    role: UserRole = Field(default=UserRole.student, sa_column=Column(Enum(UserRole)))
    team_id: int = Field(foreign_key='team.id', nullable=True)
    is_captain: bool = Field(default=False)
    personal_rating: float = Field(default=0)
    is_blocked: bool = Field(default=False)
    login: str | None = None
    password_hash: str | None = None
    created_at: datetime = Field()