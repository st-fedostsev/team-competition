from pydantic import BaseModel
from typing import Optional
from models import UserRole, Team, League, EventFormat, KnowledgePostType, ModerationStatus
from datetime import datetime
import uuid

class KnowledgePostCreateData(BaseModel):
    type: KnowledgePostType
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None

class KnowledgePostData(BaseModel):
    id: int
    team_id: int
    type: KnowledgePostType
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None
    status: ModerationStatus