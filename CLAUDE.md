# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Проект

**Focus Widgets** — мобильное приложение под Android, которое позволяет создавать крупные виджеты со списком **Задач** из **Todoist** (Task), отфильтрованных по проекту, приоритету, дате выполнения или лейблу. Не создано и не поддерживается Doist

Полное техническое задание — [`docs/SPECIFICATION.md`](docs/SPECIFICATION.md). Навигация по всей документации — [`docs/README.md`](docs/README.md), начинай оттуда, если нужен контекст за пределами этого файла.

Проект на стадии инициализации: описано ТЗ, сгенерирован базовый Expo-скаффолд без экранов и бизнес-логики.

## Тех. стек

- **Expo** + **Expo Router** (файловая маршрутизация в `src/app/`) — см. [`AGENTS.md`](AGENTS.md) за правилами работы с версией SDK
- **React Native** + **React Compiler** (автомемоизация, `experiments.reactCompiler` в `app.json`)
- **React Native Android Widget** ([`react-native-android-widget`](https://www.npmjs.com/package/react-native-android-widget)) — рендеринг Android-виджетов (`Pin`, `List`) React-компонентами через `FlexWidget`/`ListWidget`
- **[Todoist SDK](https://www.npmjs.com/package/@doist/todoist-sdk)** (`@doist/todoist-sdk`) — типизированный клиент Todoist API, включая Todoist Sync API (см. [`docs/TODOIST_SYNC_API.md`](docs/TODOIST_SYNC_API.md))
- **TanStack Query** — серверное состояние и кэш запросов к Todoist API через Todoist SDK
- **React Hook Form** + **Zod** — формы и их валидация
- **expo-sqlite** — локальное хранение конфигурации фильтров виджетов
- **expo-secure-store** — хранение Todoist Access Token
- **Biome** — линт и форматирование, **Jest** (`jest-expo`) + **Testing Library** — тесты

Полная таблица стека с назначением каждой технологии в проекте — в разделе «Технологический стек» [`docs/CODE_STYLE_GUIDE.md`](docs/CODE_STYLE_GUIDE.md).

## Команды

```bash
bunx expo start               # dev-сервер
bunx biome check .            # линт + проверка форматирования
bunx biome check --write .    # линт + форматирование с автофиксом
bunx tsc --noEmit             # typecheck
bunx jest                     # все тесты
bunx jest path/to/file.spec.ts   # один файл тестов
bunx jest -t "название теста"    # тесты по названию
bunx expo-doctor              # диагностика зависимостей (обязательно при их изменении)
bunx expo install --fix       # правка несовместимых версий пакетов
```

Перед завершением задачи — `bunx tsc --noEmit`, `bunx biome check --write .`, `bunx jest` (порядок и полный SDLC — в разделе «SDLC» [`docs/CODE_STYLE_GUIDE.md`](docs/CODE_STYLE_GUIDE.md)).

## Архитектура

**Feature-Sliced Design**, слои сверху вниз (верхний импортирует только из нижних): `app` → `pages` → `widgets` → `features` → `entities` → `shared`, алиасы `@/app`, `@/pages`, `@/widgets`, `@/features`, `@/entities`, `@/shared`. Внутри слайса — сегменты `ui/`, `model/`, `api/`; наружу слайс отдаёт только `index.ts`. Todoist API и `expo-sqlite` вызываются напрямую из `api/`-сегментов, без собственных обёрток/репозиториев.

Слоёв `widgets` и `app`-провайдеров в коде пока нет — реализованы `entities/task`, `entities/label`, `entities/project`, `entities/filter`, `features/login`, `pages/login`, `pages/widget-list` и роуты `src/app/(auth)`, `src/app/(app)`. Полные правила архитектуры, naming, работы с TanStack Query/React Hook Form и React Compiler — [`docs/CODE_STYLE_GUIDE.md`](docs/CODE_STYLE_GUIDE.md).

## Docs-as-code

Документация в `docs/` — часть кодовой базы, актуализируется в том же коммите, что и код. Единственная точка входа — [`docs/README.md`](docs/README.md): дерево **Файловая структура** там описывает назначение каждого файла в `docs/`, включая ТЗ ([`SPECIFICATION.md`](docs/SPECIFICATION.md)), архитектуру и стиль кода ([`CODE_STYLE_GUIDE.md`](docs/CODE_STYLE_GUIDE.md)), ресёрчи по Todoist Sync API и `react-native-android-widget`, а также ADR в `docs/decisions/`. При добавлении, удалении или изменении сути файла в `docs/` — обнови это дерево в том же коммите; полные правила форматирования — там же.

## Дизайн

Дизайн ведётся в Claude Design: [`Focus Widget.dc.html`](https://claude.ai/design/p/3e658d39-2a01-4ab3-b579-28990096c038?file=Focus+Widget.dc.html). Импортируется через `claude_design` MCP (`https://api.anthropic.com/v1/design/mcp`, авторизация `/design-login`) — подробности и список читаемых файлов проекта в разделе «Дизайн» [`docs/SPECIFICATION.md`](docs/SPECIFICATION.md).

## AI-инфраструктура (Claude Code)

Установлены два официальных плагина (см. [`.claude/settings.json`](.claude/settings.json)):

- `expo@claude-plugins-official` — набор скиллов для разработки на Expo (роутинг, нативные модули, EAS-сервисы и т.д.). Перед добавлением зависимостей и решением незнакомых Expo/EAS-задач проверяй, не покрыта ли задача одним из этих скиллов
- `ponytail@ponytail` — набор скиллов против переусложнения кода (YAGNI, минимальный диф, ревью и аудит на оверинжиниринг)

### Установленные скиллы

| Скилл | Источник | Назначение |
|---|---|---|
| [`git-commit`](.claude/skills/git-commit/SKILL.md) | самописный | Формирует conventional commit message по staged changes, диалогу сессии и переданному аргументу, коммитит после подтверждения |
| [`feature`](.claude/skills/feature/SKILL.md) | самописный | Принимает описание задачи, подгружает [`docs/CODE_STYLE_GUIDE.md`](docs/CODE_STYLE_GUIDE.md), разбивает задачу на пункты плана и реализует их по очереди с прогоном lint/typecheck/test, останавливаясь на ревью без коммита |
| [`accept-adr`](.claude/skills/accept-adr/SKILL.md) | самописный | Приводит ADR-файл из `docs/decisions/` к шаблону и проводит строгое ревью содержимого, согласованности с другими решениями и соответствия критериям ADR |

### Слэш-команды

| Команда | Действие |
|---|---|
| `/git-commit [аргумент]` | вызывает скилл `git-commit` |
| `/feature <описание задачи>` | вызывает скилл `feature` |
| `/accept-adr <путь к файлу>` | вызывает скилл `accept-adr` |

### Правило актуализации

При добавлении, изменении или удалении скилла, команды, MCP-сервера, агента или хука — **в том же коммите** обнови таблицы в этом разделе и любые перекрёстные ссылки в [`docs/README.md`](docs/README.md), которые это затрагивает.

## Правила форматирования документации

Документация в `docs/` пишется на русском языке; полный набор правил (выделение бизнес-сущностей, полей, отступы) — в разделе «Правила форматирования» [`docs/README.md`](docs/README.md).
