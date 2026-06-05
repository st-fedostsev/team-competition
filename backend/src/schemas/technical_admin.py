from pydantic import BaseModel
from typing import Optional

class BanData(BaseModel):
    user_id: int
    ban: bool

class EditUserData(BaseModel):
    user_id: int
    new_rating: Optional[float]
    last_name: Optional[str]
    first_name: Optional[str]
    patronymic: Optional[str]