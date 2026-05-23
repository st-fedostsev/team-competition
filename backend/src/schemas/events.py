from pydantic import BaseModel
from typing import Optional
from models import UserRole, Team, League, EventFormat
from datetime import datetime
import uuid

class EventCreateData(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    format: EventFormat
    is_official: bool

class EventData(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    date: datetime
    format: EventFormat
    created_by: int
    is_official: bool
