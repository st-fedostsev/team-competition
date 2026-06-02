from sqlmodel import Field, Session, SQLModel, Relationship, Column
from sqlalchemy import BigInteger
from datetime import datetime

class Vote(SQLModel, table=True):
    id: int = Field(primary_key=True)
    team_id: int = Field(foreign_key='team.id')
    voter_id: int = Field(foreign_key='users.id')
    target_id: int = Field(foreign_key='users.id')
    score: int = Field()
    voted_at: datetime = Field()