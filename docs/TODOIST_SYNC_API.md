# Todoist Sync API — ресёрч

> Основано только на официальной документации [Todoist API v1](https://developer.todoist.com/api/v1/) и исходном коде [Doist/todoist-sdk-typescript](https://github.com/Doist/todoist-sdk-typescript)


## Суть ручки

`/api/v1/sync` — единственный эндпоинт, спроектированный не для CRUD-операций над отдельными сущностями (как REST), а для эффективной синхронизации локальной копии данных клиента с сервером. Он рассчитан на "тяжёлые" клиенты (мобильные приложения, десктоп), которым нужно держать локальный кэш проектов/задач/лейблов и обновлять его без лишнего трафика

Технически это POST-эндпоинт с телом `application/x-www-form-urlencoded`, ответ — JSON. Один запрос одновременно может **читать** (через <u>resource_types</u>) и **писать** (через <u>commands</u>) — это принципиально отличает его от REST, где чтение и запись — разные вызовы к разным ресурсам


## Возможности

### Инкрементальная синхронизация (sync_token)

- Первый запрос: <u>sync_token</u>`='*'` → полный синк, сервер отдаёт все активные ресурсы пользователя, ответ помечен <u>full_sync</u>`: true`
- Сервер возвращает новый <u>sync_token</u> в ответе
- Каждый следующий запрос передаёт этот токен → сервер отдаёт только то, что изменилось с прошлого раза

Для больших аккаунтов данные полного синка могут приходить с задержкой — проверяется полем <u>full_sync_date_utc</u>; если оно заметно отстаёт от текущего UTC, стоит сразу сделать доинкрементальный синк тем же токеном из ответа

### Выборочная загрузка ресурсов (resource_types)

JSON-массив типов, которые нужно получить: `projects`, `items`, `labels`, `sections`, `filters`, `reminders`, `notes`, `user`, `completed_info` и т.д., либо `"all"` для всего сразу. Префикс `"-"` исключает тип из общей выборки

### Пакетные команды на запись (commands)

Запись выполняется не отдельными PUT/POST на ресурс, а массивом команд в одном запросе — это снижает число сетевых вызовов и обходит rate-limit. Каждая команда:

```json
{
  "type": "item_add",
  "temp_id": "43f7ed23-...",
  "uuid": "849fff4e-...",
  "args": { "content": "Buy Milk", "project_id": "..." }
}
```

- <u>uuid</u> — обеспечивает идемпотентность: повторная отправка команды с тем же uuid не выполнится дважды (безопасные ретраи)
- <u>temp_id</u> — позволяет в одном запросе создать ресурс и тут же сослаться на него в другой команде (например, создать проект и сразу добавить в него задачу); сервер возвращает <u>temp_id_mapping</u>, сопоставляющий временные ID с настоящими

### Результат команд (sync_status)

Каждая команда получает статус по своему <u>uuid</u> — либо `"ok"`, либо объект ошибки (<u>error_tag</u>, <u>error_code</u>, <u>http_code</u>, <u>error_extra</u>). 400 — терминальная ошибка (не ретраить), 429/5xx — можно повторить


## Доступ через @doist/todoist-sdk

SDK не прячет Sync API за высокоуровневой абстракцией — даёт «сырой» доступ через метод `TodoistApi.sync()`:

```typescript
import { TodoistApi, createCommand } from '@doist/todoist-sdk'

const api = new TodoistApi(token)

const response = await api.sync({
  commands: [createCommand('item_add', { content: 'Buy milk' })],
  resourceTypes: ['items'],
  syncToken: '*',
})
```

Сигнатура (из исходников `src/todoist-api.ts`):

```typescript
async sync(syncRequest: SyncRequest, requestId?: string): Promise<SyncResponse>
```

- `createCommand(type, args)` — хелпер, собирающий `{ type, args }` (uuid/temp_id генерируются SDK автоматически внутри)
- Ответ автоматически конвертируется в camelCase: <u>sync_token</u> → <u>syncToken</u>, <u>full_sync</u> → <u>fullSync</u>, <u>temp_id_mapping</u> → <u>tempIdMapping</u>
- При ошибке в <u>sync_status</u> SDK бросает `TodoistRequestError`

Форма ответа подтверждена тестовым файлом `src/todoist-api.sync.test.ts`: `{ syncToken, items, labels, sections, ... }`


## Применение в Focus Widgets

По [`SPECIFICATION.md`](SPECIFICATION.md) задачи фильтруются по проекту/приоритету/дате/лейблу, а данные виджета обновляются: при входе, при тапе на виджет и раз в 30 минут через `updatePeriodMillis`

Ключевые выводы:

- REST-эндпоинты SDK (`getTasks`, `getProjects` и т.п.) подходят для разовых запросов (например, проверка токена на экране авторизации), но при каждом обновлении виджета тянут полный список задач заново
- Sync-эндпоинт подходит лучше для фонового обновления: сохранить <u>syncToken</u> (например, в SQLite рядом с конфигурацией фильтров) и на каждый из трёх триггеров обновления делать инкрементальный запрос с `resourceTypes: ['items', 'projects', 'labels']` — сервер вернёт только дельту, а не весь список задач заново. Это особенно важно для триггера "раз в 30 минут" — фоновый worker виджета не должен тянуть весь аккаунт целиком при каждом тике
- Фильтрация по query-строке (И/ИЛИ между условиями) всё равно должна выполняться на клиенте после синка — сам Sync API не фильтрует задачи по кастомным условиям, он просто отдаёт список изменённых сущностей
- Команды на запись (<u>commands</u>) в спецификации напрямую не нужны — приложение не создаёт/не редактирует задачи в Todoist, только читает их для виджетов (запись происходит через deeplink `todoist://` обратно в само приложение Todoist)


## Источники

- [Todoist API v1 Documentation](https://developer.todoist.com/api/v1/)
- [Doist/todoist-sdk-typescript (GitHub)](https://github.com/Doist/todoist-sdk-typescript)
- [Doist/todoist-sdk-typescript — sync test source](https://raw.githubusercontent.com/Doist/todoist-sdk-typescript/main/src/todoist-api.sync.test.ts)
