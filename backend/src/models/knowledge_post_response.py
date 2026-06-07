from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
from datetime import datetime
import enum

class KnowledgePostResponseStatus(str, enum.Enum):
    awaiting = 'awaiting'
    approved = 'approved'
    rejected = 'rejected'

class KnowledgePostResponse(SQLModel, table=True):
    id: int = Field(primary_key=True)
    from_team_id: int = Field(foreign_key='team.id')
    knowledge_post_id: int = Field(foreign_key='knowledgepost.id')
    status: KnowledgePostResponseStatus = Field(default=KnowledgePostResponseStatus.awaiting, sa_column=Column(Enum(KnowledgePostResponseStatus)))
    response_file_url: str = Field(nullable=True, default=None)
    response_comment: str = Field(nullable=True, default=None)