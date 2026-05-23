from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
from datetime import datetime
import enum
from .moderation_status import ModerationStatus

class KnowledgePostType(str, enum.Enum):
    request = 'request'
    offer = 'offer'

class KnowledgePost(SQLModel, table=True):
    id: int = Field(primary_key=True)
    team_id: int = Field()
    type: KnowledgePostType = Field(default=KnowledgePostType.request, sa_column=Column(Enum(KnowledgePostType)))
    title: str = Field()
    description: str | None = None
    tags: str | None = None
    status: ModerationStatus = Field(default=ModerationStatus.on_moderation, sa_column=Column(Enum(ModerationStatus)))
