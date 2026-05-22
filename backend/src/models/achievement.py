from sqlmodel import Field, Session, SQLModel, Relationship, Column, select
from sqlalchemy import BigInteger
from datetime import datetime
from typing import Any

class Achievement(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key='user.id')
    title: str = Field()
    description: str = Field()
    earned_at: datetime = Field()

    @staticmethod
    def give(session: Any, user_id: int, title: str, description: str):
        q = select(Achievement).where((Achievement.user_id == user_id) & (Achievement.title == title))
        if len(session.exec(q).all()) > 0:
            return
        session.add(Achievement(
            user_id=user_id,
            title=title,
            description=description,
            earned_at=datetime.now()
        ))
        session.commit()