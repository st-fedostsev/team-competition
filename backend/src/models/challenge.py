from sqlmodel import Field, Session, SQLModel, Relationship, Column
from sqlalchemy import BigInteger
from datetime import datetime

class Challenge(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str = Field()
    description: str = Field()
    deadline: datetime = Field()
    created_by: int = Field(foreign_key='user.id')
    is_active: bool = Field(default=True)