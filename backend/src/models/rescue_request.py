from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
from datetime import datetime
import enum

class RescueRequestStatus(str, enum.Enum):
    awaiting = 'awaiting'
    working = 'working'
    approved = 'approved'
    rejected = 'rejected'

class RescueRequest(SQLModel, table=True):
    id: int = Field(primary_key=True)
    requester_team_id: int = Field(foreign_key='team.id')
    helper_team_id: int = Field(foreign_key='team.id', nullable=True, default=None)
    description: str = Field()
    status: RescueRequestStatus = Field(default=RescueRequestStatus.awaiting, sa_column=Column(Enum(RescueRequestStatus)))
    bonus_points: int | None = None