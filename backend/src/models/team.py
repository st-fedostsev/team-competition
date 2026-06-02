from sqlmodel import Field, Session, SQLModel, Relationship, Column, Enum, select, column
from sqlalchemy import BigInteger
import enum
from datetime import datetime
import uuid
from typing import Any
from .user import User
from .rescue_request import RescueRequest
from .vote import Vote
from .achievement import Achievement
from .achievement_templates import ACHIEVEMENTS


class League(str, enum.Enum):
    novice = 'novice'
    pro = 'pro'
    legend = 'legend'

class Team(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field()
    crc: float = Field(default=0)
    league: League = Field(default=League.novice, sa_column=Column(Enum(League)))
    captain_id: int = Field(foreign_key='user.id')
    created_at: datetime = Field()
    secret_code: uuid.UUID = Field(default_factory=uuid.uuid4)

    def update_crc(self, session: Any):
        q = select(User).where(User.team_id == self.id)
        members = session.exec(q).all()
        members_mean = sum(map(lambda x: x.personal_rating, members)) / len(members)

        member_ids = list(map(lambda x: x.id, members))
        q = select(Vote).where(column('target_id').in_(member_ids) & (Vote.team_id == self.id))
        votes = session.exec(q).all()
        unity = 0
        if len(votes) > 0:
            unity = sum(map(lambda x: x.score, votes)) / len(votes)

        q = select(RescueRequest).where(RescueRequest.helper_team_id == self.id)
        rescue_requests = session.exec(q).all()
        bonus = sum(map(lambda x: x.bonus_points, rescue_requests))
        self.crc = members_mean * 0.6 + unity * 0.3 + bonus # * 0.1 <---- UNCOMMENT LATER!!
        session.add(self)
        session.commit()

        q = select(Team).order_by(-Team.crc).limit(10)
        teams_ids = list(map(lambda x: x.id, session.exec(q)))
        if self.id in teams_ids:
            for member_id in member_ids:
                Achievement.give(session, member_id, ACHIEVEMENTS['top_10'])

        if self.id in teams_ids[:5]:
            for member_id in member_ids:
                Achievement.give(session, member_id, ACHIEVEMENTS['top_5'])

# required for search
LEAGUES_LOCALIZED = {
    'новички': League.novice,
    'профи': League.pro,
    'легенды': League.legend
}
def get_league_by_partial_name(name: str) -> League:
    for k in LEAGUES_LOCALIZED.keys():
        if k.startswith(name.lower()):
            return LEAGUES_LOCALIZED[k]
    return None