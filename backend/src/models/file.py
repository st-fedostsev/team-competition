from sqlmodel import Field, Session, SQLModel, Relationship, Column, LargeBinary
from sqlalchemy import BigInteger
from datetime import datetime
import enum

class File(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field()
    data: bytes = Field(sa_column=Column(LargeBinary))
    author_id: int = Field(foreign_key='user.id')
    created_at: datetime = Field()
