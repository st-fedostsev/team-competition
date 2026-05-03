from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
import enum
from datetime import datetime

class League(str, enum.Enum):
    novice = 'novice'
    pro = 'pro'
    legend = 'legend'

class Team(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field()
    crc: float = Field(default=0)
    league: League = Field(default=League.novice, sa_column=Column(Enum(League)))
    captain_id: int = Field(foreign_key='user.id')
    created_at: datetime = Field()