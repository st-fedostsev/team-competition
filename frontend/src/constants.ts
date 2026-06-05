export const HEADERS_LIST_STUDENT = [
  { label: 'Лента', path: '/lenta' },
  { label: 'Биржа знаний', path: '/knowledge' },
  { label: 'Календарь', path: '/calendar' },
  { label: 'Рейтинг', path: '/rating' },
];

export const HEADERS_LIST_TECH_ADMIN = [
  { label: 'Пользователи', path: '/admin/users' },
  // { label: 'Логи', path: '/admin/logs' },
  // { label: 'Резервное копирование', path: '/admin/backup' },
  { label: 'Рейтинг', path: '/admin/rating/students' },
  { label: 'Интеграции', path: '/admin/integrations' },
];

export const HEADERS_LIST_CONTENT_MANAGER =[
  { label: 'Лента', path: '/ContentManager/lenta' },
  { label: 'Модерация', path: '/moderation' },
];

export const HEADERS_LIST_GAME_ADMIN =[
  {label: 'Команды', path: '/game-admin/teams'},
  {label: 'Заявки', path: '/game-admin/applications'},
  {label: 'Рейтинг', path: '/game-admin/rating'},
]

export const FEED_TABS = [
  { label: 'Мероприятия', value: '/events' },
  { label: 'Челленджи', value: '/challenges' },
  { label: 'Новости', value: '/news' },
];

export const MODERATION_TABS = [
  { label: 'Отчеты', value: '/reports' },
  { label: 'Биржа', value: '/market' },
  { label: 'Мероприятия', value: '/events' },
];

export const RATING_TABS = [
  { label: 'Студенты', path: '/rating' },
  { label: 'Команды', path: '/rating/teams' },
];

export const TABS = [
  { label: 'Мероприятия', path: '/lenta' },
  { label: 'Челленджи', path: '/challenges' },
  { label: 'Новости', path: '/announcements' },
];

export const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

export const TIME_SLOTS = [
  '08:00-\n09:00',
  '09:00-\n10:00',
  '10:00-\n11:00',
  '11:00-\n12:00',
  '12:00-\n13:00',
  '13:00-\n14:00',
  '15:00-\n16:00',
  '16:00-\n17:00',
  '17:00-\n18:00',
  '18:00-\n19:00',
  '19:00-\n20:00',
  '20:00-\n21:00',
  '21:00-\n22:00',
  '22:00-\n23:00',
  '23:00-\n23:59',
];
