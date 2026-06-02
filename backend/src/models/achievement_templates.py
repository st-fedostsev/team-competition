from pydantic import BaseModel

class AchievementTemplate(BaseModel):
    title: str
    description: str

ACHIEVEMENTS = {
    'my_first_team': AchievementTemplate(title='Моя первая команда', description='Создайте или вступите в команду'),
    'beginning_of_the_path': AchievementTemplate(title='Начало пути', description='Поучаствуйте в 3 челленджах'),
    'event_master': AchievementTemplate(title='Мастер ивентов', description='Создайте 2 мероприятия'),
    'top_10': AchievementTemplate(title='Топ 10', description='Попадите в топ 10 как команда'),
    'top_5': AchievementTemplate(title='Топ 5', description='Попадите в топ 5 как команда'),
    'instructor': AchievementTemplate(title='Наставник', description='Предложите помощь на бирже знаний'),
    'brave_novice': AchievementTemplate(title='Смелый новичок', description='Попросите помощь на бирже знаний'),
}