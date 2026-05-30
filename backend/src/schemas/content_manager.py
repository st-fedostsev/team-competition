from pydantic import BaseModel
from typing import Optional
from models import ModerationStatus

class SendNotificationData(BaseModel):
    user_ids: Optional[list[int]] = None
    send_all: bool
    title: str
    body: str

class ModerationData(BaseModel):
    id: int
    new_status: ModerationStatus