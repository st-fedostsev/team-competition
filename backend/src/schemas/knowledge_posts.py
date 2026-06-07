from pydantic import BaseModel
from typing import Optional
from models import UserRole, Team, League, EventFormat, KnowledgePostType, ModerationStatus, KnowledgePostWorkStatus
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
    work_status: KnowledgePostWorkStatus

class ApprovePostResponseData(BaseModel):
    id: int

class SendResponseReportData(BaseModel):
    response_id: int
    file_url: str
    comment: str

class KnowledgePostIdData(BaseModel):
    id: int