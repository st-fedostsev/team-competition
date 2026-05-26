# Командный зачёт

# Стек
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Rsbuild](https://img.shields.io/badge/rsbuild-%23FFB300.svg?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBmaWxsPSIjRkZCMzAwIiBkPSJNMTAwIDBMMjAwIDUwdjEwMEwxMDAgMjAwIDAgMTUwVjUweiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMDAgMjBMNjAgNDB2ODBsNDAgMjAgNDAtMjBWODB6Ii8+PHRleHQgeD0iMTAwIiB5PSIxMjAiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkIzMDAiIGZvbnQtd2VpZ2h0PSJib2xkIj5SUzwvdGV4dD48L3N2Zz4=) ![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white) ![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

```text
team-competition/
├── backend/
│   └── src/
│       ├─── main.py - точка входа в приложение
│       ├─── auth - настройки аутентификации
│       │    └── auth_handler.py
│       ├───database - настройки подключения к БД
│       │    └── session.py
│       ├───middlewares - middleware классы
│       │    ├── auth.py
│       │    └── ban.py
│       ├───models - ORM модели
│       │   ├── achievement.py
│       │   ├── achievement_templates.py
│       │   ├── challenge.py
│       │   ├── challenge_report.py
│       │   ├── event.py
│       │   ├── knowledge_post.py
│       │   ├── moderation_status.py
│       │   ├── news.py
│       │   ├── notification.py
│       │   ├── notification_templates.py
│       │   ├── rescue_request.py
│       │   ├── team.py
│       │   ├── user.py
│       │   └── vote.py
│       ├───routers - реализация API эндпоинтов
│       │   ├── challenges.py
│       │   ├── content_manager.py
│       │   ├── events.py
│       │   ├── knowledge_posts.py
│       │   ├── news.py
│       │   ├── team.py
│       │   ├── technical_admin.py
│       │   └── users.py
│       └───schemas - схемы API объектов
│           ├── challenges.py
│           ├── common.py
│           ├── content_manager.py
│           ├── events.py
│           ├── knowledge_posts.py
│           ├── news.py
│           ├── team.py
│           ├── technical_admin.py
│           └── users.py
└── frontend/
```

# Архитектура базы данных сервиса
![База данных](https://drive.google.com/uc?export=download&id=1FuJgHm436JB7hE8Qy6iltuQyUqLheDuS)

# Документация API

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/users/login_admin](#postuserslogin_admin) | Аутентификация |
| POST | [/users/login](#postuserslogin) | Аутентификация |
| POST | [/users/refresh](#postusersrefresh) | Обновления JWT токена |
| POST | [/users/register](#postusersregister) | Регистрация пользователя(вызывается администратором) |
| GET | [/users/me](#getusersme) | Получить данные своего профиля |
| POST | [/users/edit](#postusersedit) | Редактировать профиль |
| POST | [/users/leaderboard](#postusersleaderboard) | Получить лидерборд рейтингов пользователей |
| GET | [/users/my_achievements](#getusersmy_achievements) | Получить список своих достижений |
| GET | [/users/all_achievements](#getusersall_achievements) | Получить список всех достижений |
| POST | [/users/get](#postusersget) | Получить пользователя |
| POST | [/users/change_credentials](#postuserschange_credentials) | Изменить данные для входа(только для администраторов и контент-менеджеров) |
| POST | [/users/get_notifications](#postusersget_notifications) | Получить уведомления |
| POST | [/users/dismiss_notification](#postusersdismiss_notification) | Отметить уведомление как просмотренное |
| POST | [/team/create](#postteamcreate) | Создать команду |
| GET | [/team/get_my](#getteamget_my) | Получить информацию о своей команде |
| POST | [/team/get_by_id](#postteamget_by_id) | Получить команду по id |
| POST | [/team/get_by_code](#postteamget_by_code) | Получить команду по секретному коду |
| POST | [/team/regenerate_code](#postteamregenerate_code) | Сгенерировать новый код приглашения(доступно только капитану) |
| POST | [/team/leave](#postteamleave) | Выйти из команды |
| POST | [/team/join](#postteamjoin) | Присоединиться к команде |
| POST | [/team/search](#postteamsearch) | Поиск команды |
| POST | [/team/leaderboard](#postteamleaderboard) | Получить лидерборд рейтингов команд |
| POST | [/team/kick](#postteamkick) | Исключить пользователя из команды |
| POST | [/events/create](#posteventscreate) | Создать мероприятие |
| POST | [/events/list](#posteventslist) | Получить список мероприятий |
| POST | [/challenges/create](#postchallengescreate) | Создать челлендж |
| POST | [/challenges/list](#postchallengeslist) | Получить список челленджей |
| POST | [/challenges/send_report](#postchallengessend_report) | Отправить отчет по челленджу |
| POST | [/news/create](#postnewscreate) | Создать новость |
| POST | [/news/list](#postnewslist) | Получить список новостей |
| POST | [/knowledge_posts/create](#postknowledge_postscreate) | Создать объявление на бирже знаний |
| POST | [/knowledge_posts/list](#postknowledge_postslist) | Получить список объявлений |
| POST | [/technical_admin/ban](#posttechnical_adminban) | Заблокировать/разблокировать пользователя |
| POST | [/technical_admin/edit_rating](#posttechnical_adminedit_rating) | Изменить персональный рейтинг пользователя |
| POST | [/technical_admin/import_users](#posttechnical_adminimport_users) | Импортировать пользователей из файла |
| POST | [/content_manager/send_notification](#postcontent_managersend_notification) | Отправить уведомление пользователям |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| BanData | [#/components/schemas/BanData](#componentsschemasbandata) |  |
| Body_import_users_technical_admin_import_users_post | [#/components/schemas/Body_import_users_technical_admin_import_users_post](#componentsschemasbody_import_users_technical_admin_import_users_post) |  |
| ChallengeCreateData | [#/components/schemas/ChallengeCreateData](#componentsschemaschallengecreatedata) |  |
| ChallengeReportData | [#/components/schemas/ChallengeReportData](#componentsschemaschallengereportdata) |  |
| ChangeCredentialsData | [#/components/schemas/ChangeCredentialsData](#componentsschemaschangecredentialsdata) |  |
| DismissNotificationData | [#/components/schemas/DismissNotificationData](#componentsschemasdismissnotificationdata) |  |
| EditRatingData | [#/components/schemas/EditRatingData](#componentsschemaseditratingdata) |  |
| EventCreateData | [#/components/schemas/EventCreateData](#componentsschemaseventcreatedata) |  |
| EventFormat | [#/components/schemas/EventFormat](#componentsschemaseventformat) |  |
| GetTeamByCodeData | [#/components/schemas/GetTeamByCodeData](#componentsschemasgetteambycodedata) |  |
| GetTeamByIdData | [#/components/schemas/GetTeamByIdData](#componentsschemasgetteambyiddata) |  |
| JoinTeamData | [#/components/schemas/JoinTeamData](#componentsschemasjointeamdata) |  |
| KickUserData | [#/components/schemas/KickUserData](#componentsschemaskickuserdata) |  |
| KnowledgePostCreateData | [#/components/schemas/KnowledgePostCreateData](#componentsschemasknowledgepostcreatedata) |  |
| KnowledgePostType | [#/components/schemas/KnowledgePostType](#componentsschemasknowledgeposttype) |  |
| LoginAdminData | [#/components/schemas/LoginAdminData](#componentsschemasloginadmindata) |  |
| LoginData | [#/components/schemas/LoginData](#componentsschemaslogindata) |  |
| Message | [#/components/schemas/Message](#componentsschemasmessage) |  |
| NewsCreateData | [#/components/schemas/NewsCreateData](#componentsschemasnewscreatedata) |  |
| PagedRequestData | [#/components/schemas/PagedRequestData](#componentsschemaspagedrequestdata) |  |
| PagedRequestQueryData | [#/components/schemas/PagedRequestQueryData](#componentsschemaspagedrequestquerydata) |  |
| RegisterData | [#/components/schemas/RegisterData](#componentsschemasregisterdata) |  |
| SearchTeamData | [#/components/schemas/SearchTeamData](#componentsschemassearchteamdata) |  |
| SendNotificationData | [#/components/schemas/SendNotificationData](#componentsschemassendnotificationdata) |  |
| TeamCreateData | [#/components/schemas/TeamCreateData](#componentsschemasteamcreatedata) |  |
| UserEditData | [#/components/schemas/UserEditData](#componentsschemasusereditdata) |  |
| UserGetData | [#/components/schemas/UserGetData](#componentsschemasusergetdata) |  |
| UserRole | [#/components/schemas/UserRole](#componentsschemasuserrole) |  |
| JwtRefreshBearer | [#/components/securitySchemes/JwtRefreshBearer](#componentssecurityschemesjwtrefreshbearer) |  |
| JwtAccessBearer | [#/components/securitySchemes/JwtAccessBearer](#componentssecurityschemesjwtaccessbearer) |  |
| JwtAccessCookie | [#/components/securitySchemes/JwtAccessCookie](#componentssecurityschemesjwtaccesscookie) |  |

## Path Details

***

### [POST]/users/login_admin

- Summary  
Аутентификация

- Operation id  
login_admin_users_login_admin_post

#### RequestBody

- application/json

```typescript
{
  login: string
  password: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/login

- Summary  
Аутентификация

- Operation id  
login_user_users_login_post

#### RequestBody

- application/json

```typescript
{
  last_name: string
  first_name: string
  student_id: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/refresh

- Summary  
Обновления JWT токена

- Operation id  
refresh_token_users_refresh_post

- Security  
JwtRefreshBearer  

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/register

- Summary  
Регистрация пользователя(вызывается администратором)

- Operation id  
register_user_users_register_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  last_name: string
  first_name: string
  patronymic?: Partial(string) & Partial(null)
  student_id: integer
  user_role: enum[student, content_manager, admin, technical_admin]
  login?: Partial(string) & Partial(null)
  password?: Partial(string) & Partial(null)
  personal_rating?: number
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [GET]/users/me

- Summary  
Получить данные своего профиля

- Operation id  
user_me_users_me_get

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/edit

- Summary  
Редактировать профиль

- Operation id  
user_edit_users_edit_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  last_name: Partial(string) & Partial(null)
  first_name: Partial(string) & Partial(null)
  patronymic: Partial(string) & Partial(null)
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/leaderboard

- Summary  
Получить лидерборд рейтингов пользователей

- Operation id  
user_get_leaderboard_users_leaderboard_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  query: string
  offset: integer
  limit: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [GET]/users/my_achievements

- Summary  
Получить список своих достижений

- Operation id  
my_achievements_users_my_achievements_get

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [GET]/users/all_achievements

- Summary  
Получить список всех достижений

- Operation id  
all_achievements_users_all_achievements_get

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/get

- Summary  
Получить пользователя

- Operation id  
get_user_users_get_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  id: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/change_credentials

- Summary  
Изменить данные для входа(только для администраторов и контент-менеджеров)

- Operation id  
user_change_credentials_users_change_credentials_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  new_login?: Partial(string) & Partial(null)
  old_password: string
  new_password?: Partial(string) & Partial(null)
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/get_notifications

- Summary  
Получить уведомления

- Operation id  
user_get_notifications_users_get_notifications_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  offset: integer
  limit: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/users/dismiss_notification

- Summary  
Отметить уведомление как просмотренное

- Operation id  
user_dismiss_notification_users_dismiss_notification_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  id: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/create

- Summary  
Создать команду

- Operation id  
create_team_team_create_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  name: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [GET]/team/get_my

- Summary  
Получить информацию о своей команде

- Operation id  
get_my_team_team_get_my_get

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/get_by_id

- Summary  
Получить команду по id

- Operation id  
get_team_by_id_team_get_by_id_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  id: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/get_by_code

- Summary  
Получить команду по секретному коду

- Operation id  
get_team_by_code_team_get_by_code_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  secret_code: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/regenerate_code

- Summary  
Сгенерировать новый код приглашения(доступно только капитану)

- Operation id  
regenerate_code_team_team_regenerate_code_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/leave

- Summary  
Выйти из команды

- Operation id  
leave_team_team_leave_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/join

- Summary  
Присоединиться к команде

- Operation id  
join_team_team_join_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  secret_code: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/search

- Summary  
Поиск команды

- Operation id  
search_team_team_search_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  query: string
  limit: integer
  offset: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/leaderboard

- Summary  
Получить лидерборд рейтингов команд

- Operation id  
team_get_leaderboard_team_leaderboard_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  query: string
  offset: integer
  limit: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/team/kick

- Summary  
Исключить пользователя из команды

- Operation id  
kick_user_team_kick_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  id: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/events/create

- Summary  
Создать мероприятие

- Operation id  
create_event_events_create_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  title: string
  description?: Partial(string) & Partial(null)
  date: string
  format: enum[offline, online]
  is_official: boolean
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/events/list

- Summary  
Получить список мероприятий

- Operation id  
list_events_events_list_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  offset: integer
  limit: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/challenges/create

- Summary  
Создать челлендж

- Operation id  
create_challenge_challenges_create_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  title: string
  description: string
  deadline: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/challenges/list

- Summary  
Получить список челленджей

- Operation id  
list_challenges_challenges_list_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  offset: integer
  limit: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/challenges/send_report

- Summary  
Отправить отчет по челленджу

- Operation id  
send_report_challenges_send_report_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  challenge_id: integer
  file_url?: Partial(string) & Partial(null)
  comment?: Partial(string) & Partial(null)
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/news/create

- Summary  
Создать новость

- Operation id  
create_news_news_create_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  title: string
  body: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/news/list

- Summary  
Получить список новостей

- Operation id  
list_news_news_list_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  offset: integer
  limit: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/knowledge_posts/create

- Summary  
Создать объявление на бирже знаний

- Operation id  
create_post_knowledge_posts_create_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  type: enum[request, offer]
  title: string
  description?: Partial(string) & Partial(null)
  tags?: Partial(string) & Partial(null)
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/knowledge_posts/list

- Summary  
Получить список объявлений

- Operation id  
list_posts_knowledge_posts_list_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  offset: integer
  limit: integer
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/technical_admin/ban

- Summary  
Заблокировать/разблокировать пользователя

- Operation id  
ban_user_technical_admin_ban_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  user_id: integer
  ban: boolean
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/technical_admin/edit_rating

- Summary  
Изменить персональный рейтинг пользователя

- Operation id  
edit_rating_technical_admin_edit_rating_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  user_id: integer
  new_rating: number
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/technical_admin/import_users

- Summary  
Импортировать пользователей из файла

- Operation id  
import_users_technical_admin_import_users_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- multipart/form-data

```typescript
{
  file: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

***

### [POST]/content_manager/send_notification

- Summary  
Отправить уведомление пользователям

- Operation id  
send_notification_content_manager_send_notification_post

- Security  
JwtAccessBearer  
JwtAccessCookie  

#### RequestBody

- application/json

```typescript
{
  user_ids?: Partial(integer[]) & Partial(null)
  send_all: boolean
  title: string
  body: string
}
```

#### Responses

- 200 Операция завершена успешно

`application/json`

```typescript
{
  msg: string
}
```

- 400 Неверный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 401 Запрос не авториован(неправильно передан/не передан JWT токен)

`application/json`

```typescript
{
  msg: string
}
```

- 403 Неавторизованный запрос

`application/json`

```typescript
{
  msg: string
}
```

- 422 JSON передан неправильно, см. ответ сервера

## References

### #/components/schemas/BanData

```typescript
{
  user_id: integer
  ban: boolean
}
```

### #/components/schemas/Body_import_users_technical_admin_import_users_post

```typescript
{
  file: string
}
```

### #/components/schemas/ChallengeCreateData

```typescript
{
  title: string
  description: string
  deadline: string
}
```

### #/components/schemas/ChallengeReportData

```typescript
{
  challenge_id: integer
  file_url?: Partial(string) & Partial(null)
  comment?: Partial(string) & Partial(null)
}
```

### #/components/schemas/ChangeCredentialsData

```typescript
{
  new_login?: Partial(string) & Partial(null)
  old_password: string
  new_password?: Partial(string) & Partial(null)
}
```

### #/components/schemas/DismissNotificationData

```typescript
{
  id: integer
}
```

### #/components/schemas/EditRatingData

```typescript
{
  user_id: integer
  new_rating: number
}
```

### #/components/schemas/EventCreateData

```typescript
{
  title: string
  description?: Partial(string) & Partial(null)
  date: string
  format: enum[offline, online]
  is_official: boolean
}
```

### #/components/schemas/EventFormat

```typescript
enum[offline, online]
```

### #/components/schemas/GetTeamByCodeData

```typescript
{
  secret_code: string
}
```

### #/components/schemas/GetTeamByIdData

```typescript
{
  id: integer
}
```

### #/components/schemas/JoinTeamData

```typescript
{
  secret_code: string
}
```

### #/components/schemas/KickUserData

```typescript
{
  id: integer
}
```

### #/components/schemas/KnowledgePostCreateData

```typescript
{
  type: enum[request, offer]
  title: string
  description?: Partial(string) & Partial(null)
  tags?: Partial(string) & Partial(null)
}
```

### #/components/schemas/KnowledgePostType

```typescript
enum[request, offer]
```

### #/components/schemas/LoginAdminData

```typescript
{
  login: string
  password: string
}
```

### #/components/schemas/LoginData

```typescript
{
  last_name: string
  first_name: string
  student_id: integer
}
```

### #/components/schemas/Message

```typescript
{
  msg: string
}
```

### #/components/schemas/NewsCreateData

```typescript
{
  title: string
  body: string
}
```

### #/components/schemas/PagedRequestData

```typescript
{
  offset: integer
  limit: integer
}
```

### #/components/schemas/PagedRequestQueryData

```typescript
{
  query: string
  offset: integer
  limit: integer
}
```

### #/components/schemas/RegisterData

```typescript
{
  last_name: string
  first_name: string
  patronymic?: Partial(string) & Partial(null)
  student_id: integer
  user_role: enum[student, content_manager, admin, technical_admin]
  login?: Partial(string) & Partial(null)
  password?: Partial(string) & Partial(null)
  personal_rating?: number
}
```

### #/components/schemas/SearchTeamData

```typescript
{
  query: string
  limit: integer
  offset: integer
}
```

### #/components/schemas/SendNotificationData

```typescript
{
  user_ids?: Partial(integer[]) & Partial(null)
  send_all: boolean
  title: string
  body: string
}
```

### #/components/schemas/TeamCreateData

```typescript
{
  name: string
}
```

### #/components/schemas/UserEditData

```typescript
{
  last_name: Partial(string) & Partial(null)
  first_name: Partial(string) & Partial(null)
  patronymic: Partial(string) & Partial(null)
}
```

### #/components/schemas/UserGetData

```typescript
{
  id: integer
}
```

### #/components/schemas/UserRole

```typescript
enum[student, content_manager, admin, technical_admin]
```

### #/components/securitySchemes/JwtRefreshBearer

```typescript
http
```

### #/components/securitySchemes/JwtAccessBearer

```typescript
http
```

### #/components/securitySchemes/JwtAccessCookie

```typescript
{
  "type": "apiKey",
  "in": "cookie",
  "name": "access_token_cookie"
}
```
