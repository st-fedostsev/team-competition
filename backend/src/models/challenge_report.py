from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum
from sqlalchemy import BigInteger
from datetime import datetime
import enum
from .moderation_status import ModerationStatus

class ChallengeReport(SQLModel, table=True):
    id: int = Field(primary_key=True)
    challenge_id: int = Field(foreign_key='challenge.id')
    team_id: int = Field(foreign_key='team.id')
    file_url: str | None = None
    comment: str | None = None
    status: ModerationStatus = Field(default=ModerationStatus.on_moderation, sa_column=Column(Enum(ModerationStatus)))
    moderated_by: int = Field(foreign_key='user.id', nullable=True, default=None)
    moderated_at: datetime | None = None
