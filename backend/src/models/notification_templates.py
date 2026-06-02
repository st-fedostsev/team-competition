from pydantic import BaseModel

class NotificationTemplate(BaseModel):
    title: str
    body: str

NOTIFICATIONS = {
    'achievement': NotificationTemplate(title='Получено достижение', body='Вы получили новое достижение'),
    'join_request': NotificationTemplate(title='Пользователь хочет вступить в команду', body='Вы получили запрос на присоединение к команде'),
    'request_approved': NotificationTemplate(title='Запрос одобрен', body='Запрос на присоединение к команде одобрен'),
    'request_rejected': NotificationTemplate(title='Запрос отклонен', body='Запрос на присоединение к команде отклонен'),
    'event_created': NotificationTemplate(title='Мероприятие создано', body='Вы создали мероприятие'),
    'post_created': NotificationTemplate(title='Запрос на бирже знаний создан', body='Вы создали запрос на бирже знаний'),
    'accrual': NotificationTemplate(title='Начислены баллы', body='Вашей команде были начислены баллы'),
    'vote': NotificationTemplate(title='Проголосуйте', body='Нужно проголосвать за членов команды'),
    'kicked': NotificationTemplate(title='Вы исключены', body='Вас исключили из команды'),
    'new_leauge': NotificationTemplate(title='Новая лига', body='Ваша команда перешла в новую лигу'),
}