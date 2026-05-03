from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
from datetime import datetime
import enum

class RequestStatus(str, enum.Enum):
    awaiting = 'awaiting'
    working = 'working'
    approved = 'approved'
    rejected = 'rejected'

class RescueRequest(SQLModel, table=True):
    id: int = Field(primary_key=True)
    requester_team_id: int = Field(foreign_key='team.id')
    helper_team_id: int = Field(foreign_key='team.id', nullable=True, default=None)
    description: str = Field()
    status: RequestStatus = Field(default=RequestStatus.awaiting, sa_column=Column(Enum(RequestStatus)))
    bonus_points: int | None = None