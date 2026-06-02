from sqlmodel import Field, Session, SQLModel, Relationship, Column
from sqlalchemy import BigInteger
from datetime import datetime

class News(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str = Field()
    body: str = Field()
    created_at: datetime = Field()
    created_by: int = Field(foreign_key='users.id')