from pydantic import BaseModel

class NotificationTemplate(BaseModel):
    title: str
    body: str

NOTIFICATIONS = {
    'test': NotificationTemplate(title='Тестовое уведомление', body='Это тестовое уведомление!')
}