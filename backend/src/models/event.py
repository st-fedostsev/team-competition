from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
from datetime import datetime
import enum
from .moderation_status import ModerationStatus

class EventFormat(str, enum.Enum):
    offline = 'offline'
    online = 'online'

class Event(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str = Field()
    description: str | None = None
    date: datetime = Field()
    format: EventFormat = Field(default=EventFormat.offline, sa_column=Column(Enum(EventFormat)))
    created_by: int = Field(foreign_key='users.id')
    is_official: bool = Field()
    status: ModerationStatus = Field(default=ModerationStatus.on_moderation, sa_column=Column(Enum(ModerationStatus)))