from pydantic import BaseModel

class AchievementTemplate(BaseModel):
    title: str
    description: str

ACHIEVEMENTS = {
    'my_first_team': AchievementTemplate(title='Моя первая команда', description='Создайте или вступите в команду')
}