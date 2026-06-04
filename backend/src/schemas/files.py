from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FileData(BaseModel):
    id: int

class FileDescriptionData(BaseModel):
    id: int
    name: str
    display_name: Optional[str]
    size: int
    author_id: int
    created_at: datetime