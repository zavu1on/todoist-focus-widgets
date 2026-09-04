# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Проект

**Focus Widgets** — мобильное приложение под Android, которое позволяет создавать крупные виджеты со списком **Задач** из **Todoist** (Task), отфильтрованных по проекту, приоритету, дате выполнения или лейблу. Не создано и не поддерживается Doist

Полное техническое задание — [`docs/SPECIFICATION.md`](docs/SPECIFICATION.md). Навигация по всей документации — [`docs/README.md`](docs/README.md), начинай оттуда, если нужен контекст за пределами этого файла.

Проект на стадии инициализации: описано ТЗ, сгенерирован базовый Expo-скаффолд без экранов и бизнес-логики.

## Тех. стек

- **Expo** + **React Router** (Expo Router, файловая маршрутизация в `src/app/`) — см. [`AGENTS.md`](AGENTS.md) за правилами работы с версией SDK
- **React Native**
- **React Native Android Widget** ([`react-native-android-widget`](https://www.npmjs.com/package/react-native-android-widget)) — рендеринг Android-виджетов (`Pin`, `List`) React-компонентами через `FlexWidget`/`ListWidget`
- **TanStack Query** — серверное состояние и кэш запросов к Todoist API
- Локальное хранение конфигурации фильтров виджетов — SQLite (`expo-sqlite`)
- Хранение Todoist Access Token — `expo-secure-store`

## Дизайн

Дизайн ведётся в Claude Design: [`Focus Widget.dc.html`](https://claude.ai/design/p/3e658d39-2a01-4ab3-b579-28990096c038?file=Focus+Widget.dc.html). Импортируется через `claude_design` MCP (`https://api.anthropic.com/v1/design/mcp`, авторизация `/design-login`) — подробности и список читаемых файлов проекта в разделе «Дизайн» [`docs/SPECIFICATION.md`](docs/SPECIFICATION.md).

## AI-инфраструктура (Claude Code)

Установлен официальный плагин `expo@claude-plugins-official` (см. [`.claude/settings.json`](.claude/settings.json)) — набор скиллов для разработки на Expo (роутинг, нативные модули, EAS-сервисы и т.д.). Перед добавлением зависимостей и решением незнакомых Expo/EAS-задач проверяй, не покрыта ли задача одним из этих скиллов.

### Установленные скиллы

| Скилл | Источник | Назначение |
|---|---|---|
| [`git-commit`](.claude/skills/git-commit/SKILL.md) | самописный | Формирует conventional commit message по staged changes, диалогу сессии и переданному аргументу, коммитит после подтверждения |
| [`feature`](.claude/skills/feature/SKILL.md) | самописный | Принимает описание задачи, подгружает [`docs/CODE_STYLE_GUIDE.md`](docs/CODE_STYLE_GUIDE.md), разбивает задачу на пункты плана и реализует их по очереди с прогоном lint/typecheck/test, останавливаясь на ревью без коммита |

### Слэш-команды

| Команда | Действие |
|---|---|
| `/git-commit [аргумент]` | вызывает скилл `git-commit` |
| `/feature <описание задачи>` | вызывает скилл `feature` |

### Правило актуализации

При добавлении, изменении или удалении скилла, команды, MCP-сервера, агента или хука — **в том же коммите** обнови таблицы в этом разделе и любые перекрёстные ссылки в [`docs/README.md`](docs/README.md), которые это затрагивает.

## Правила форматирования документации

Документация в `docs/` пишется на русском языке; полный набор правил (выделение бизнес-сущностей, полей, отступы) — в разделе «Правила форматирования» [`docs/README.md`](docs/README.md).
