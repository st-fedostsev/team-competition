from pydantic import BaseModel

class BanData(BaseModel):
    user_id: int
    ban: bool

class EditRatingData(BaseModel):
    user_id: int
    new_rating: float