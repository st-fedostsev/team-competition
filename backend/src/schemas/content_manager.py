from pydantic import BaseModel
from typing import Optional

class SendNotificationData(BaseModel):
    user_ids: Optional[list[int]] = None
    send_all: bool
    title: str
    body: str