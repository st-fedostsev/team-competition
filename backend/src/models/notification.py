from sqlmodel import Field, Session, SQLModel, Relationship, Column, select
from sqlalchemy import BigInteger
from datetime import datetime
from .notification_templates import NotificationTemplate
from typing import Any

class Notification(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key='user.id')
    title: str = Field()
    body: str = Field()
    dismissed: bool = Field(default=False)
    created_at: datetime = Field()

    @staticmethod
    def send(session: Any, user_id: int, template: NotificationTemplate):
        session.add(Notification(
            user_id=user_id,
            title=template.title,
            body=template.body,
            created_at=datetime.utcnow()
        ))
        session.commit()