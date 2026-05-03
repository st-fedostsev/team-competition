from sqlmodel import Field, Session, SQLModel, Relationship, Column
from sqlalchemy import BigInteger
from datetime import datetime

class Achievement(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key='user.id')
    title: str = Field()
    description: str = Field()
    earned_at: datetime = Field()