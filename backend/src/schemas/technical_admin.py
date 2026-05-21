from pydantic import BaseModel

class BanData(BaseModel):
    user_id: int
    ban: bool