from pydantic import BaseModel
from typing import Optional
from models import UserRole, Team, League, RequestStatus
from datetime import datetime
import uuid

class TeamCreateData(BaseModel):
    name: str

class TeamData(BaseModel):
    id: int
    name: str
    crc: float
    league: League
    captain_id: int
    created_at: datetime
    secret_code: Optional[uuid.UUID] = None
    members: list[int]

class JoinTeamData(BaseModel):
    secret_code: uuid.UUID

class SearchTeamData(BaseModel):
    query: str
    limit: int
    offset: int

class KickUserData(BaseModel):
    id: int

class GetTeamByIdData(BaseModel):
    id: int

class GetTeamByCodeData(BaseModel):
    secret_code: uuid.UUID

class RequestJoinData(BaseModel):
    id: int

class RequestReviewData(BaseModel):
    id: int
    new_status: RequestStatus

class TransferCaptainData(BaseModel):
    id: int

class VoteData(BaseModel):
    user_id: int
    score: int

class RenameTeamData(BaseModel):
    new_name: str