from sqlmodel import Field, Session, SQLModel, Relationship, Column, select
from sqlalchemy import BigInteger
from datetime import datetime
from typing import Any
from .achievement_templates import AchievementTemplate
from .notification import Notification, NotificationTemplate
from .notification_templates import NOTIFICATIONS

class Achievement(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key='users.id')
    title: str = Field()
    description: str = Field()
    earned_at: datetime = Field()

    @staticmethod
    def give(session: Any, user_id: int, template: AchievementTemplate):
        q = select(Achievement).where((Achievement.user_id == user_id) & (Achievement.title == template.title))
        if len(session.exec(q).all()) > 0:
            return
        session.add(Achievement(
            user_id=user_id,
            title=template.title,
            description=template.description,
            earned_at=datetime.utcnow()
        ))
        session.commit()

        Notification.send(session, user_id, NotificationTemplate(title='Получено достижение', body=f'Вы получили новое достижение: "{template.title}"'))