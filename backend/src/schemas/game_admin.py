from pydantic import BaseModel
from typing import Optional
from models import UserRole, Team, League, RequestStatus
from datetime import datetime
import uuid

class AddUserToTeamData(BaseModel):
    user_id: int
    team_id: int

class KickUserFromTeamData(BaseModel):
    user_id: int

class DisbandTeamData(BaseModel):
    id: int

class EditPersonalRatingData(BaseModel):
    id: int
    new_rating: float