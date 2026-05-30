from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
from datetime import datetime
import enum
from .moderation_status import ModerationStatus

class RequestStatus(str, enum.Enum):
    awaiting = 'awaiting'
    approved = 'approved'
    rejected = 'rejected'

class JoinTeamRequest(SQLModel, table=True):
    id: int = Field(primary_key=True)
    team_id: int = Field(foreign_key='team.id')
    from_id: int = Field(foreign_key='user.id')
    status: RequestStatus = Field(default=RequestStatus.awaiting, sa_column=Column(Enum(RequestStatus)))
    created_at: datetime = Field()