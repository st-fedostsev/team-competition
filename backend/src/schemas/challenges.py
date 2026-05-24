from pydantic import BaseModel
from typing import Optional
from models import UserRole, Team, League, EventFormat, KnowledgePostType, ModerationStatus
from datetime import datetime
import uuid

class ChallengeCreateData(BaseModel):
    title: str
    description: str
    deadline: datetime

class ChallengeData(BaseModel):
    id: int
    title: str
    description: str
    deadline: datetime
    created_by: int
    is_active: bool

class ChallengeReportData(BaseModel):
    challenge_id: int
    file_url: Optional[str] = None
    comment: Optional[str] = None