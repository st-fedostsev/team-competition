from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class NewsCreateData(BaseModel):
    title: str
    body: str

class NewsData(BaseModel):
    title: str
    body: str
    created_by: int
    created_at: datetime