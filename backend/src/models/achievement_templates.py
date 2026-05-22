from .achievement import Achievement

ACHIEVEMENTS = {
    'my_first_team': lambda session, user_id: Achievement.give(session, user_id, 'Моя первая команда', 'Создайте или вступите в команду')
}