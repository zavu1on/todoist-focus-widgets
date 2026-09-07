---
name: feature
description: Takes a feature/task description, loads docs/CODE_STYLE_GUIDE.md as mandatory context, decomposes the task into a plan, then implements it point by point running lint/typecheck/tests after each — stops for human review without committing.
---

# Feature

Implements a task strictly according to [`docs/CODE_STYLE_GUIDE.md`](../../../docs/CODE_STYLE_GUIDE.md): loads the guide, breaks the task into a bottom-up plan, implements each point, verifies it, and stops on a clean diff for human review.

## Input

The task description comes from `$ARGUMENTS`. If it's empty, report:
> No task description given. Call `/feature <description>` with what needs to be built.

Stop. Don't guess a task.

---

## Pipeline

Follow the steps strictly in order.

### Step 1. Load context

Read in full, before planning anything:

1. [`docs/CODE_STYLE_GUIDE.md`](../../../docs/CODE_STYLE_GUIDE.md) — mandatory, every point of the plan and every line of code must follow it
2. [`docs/SPECIFICATION.md`](../../../docs/SPECIFICATION.md) and [`docs/README.md`](../../../docs/README.md) — when the task touches business logic or terms defined there
3. The relevant existing FSD slices (`src/entities`, `src/features`, `src/widgets`, `src/pages`, `src/shared`, `src/app`) — reuse existing query keys, schemas, and components instead of duplicating them

### Step 2. Decompose into a plan

Break the task into points bottom-up through FSD layers, per the guide's "Рецепт: как добавить функциональность" section:

1. `entities` — new or changed domain model/query keys/Zod schemas, if any
2. `features`/`widgets` — user actions and composed blocks
3. `pages` — screen composition
4. `src/app`/routing — wiring into `_layout.tsx` or a new route in `src/app/`

Each point should be a coherent, independently verifiable unit (one slice or one segment addition), not a single file. Present the plan to the user before writing code, so scope is visible up front — but do not wait for explicit approval before proceeding, unless the task is ambiguous enough to warrant a clarifying question first.

### Step 3. Implement point by point

For each plan point, in order:

1. Write the code strictly per the guide: FSD slice/segment placement, naming (`PascalCase` components, `type` not `interface`, named exports, one export per `api/` file), query key factories in `entities/*/model/`, Zod schemas as the single source of validation and type, `api/` wrapping `todoistClient`/`expo-sqlite` access — never called directly from `ui/`
2. English, B2-level, for all identifiers, comments, error messages and test text (per the guide's "Язык кода"); comments only for non-obvious logic
3. Run, in order, and fix everything they report before moving to the next point:
   ```bash
   bunx biome check --write .
   bunx tsc --noEmit
   bunx jest
   ```
4. If a check fails for a reason unrelated to this point's change (pre-existing failure), report it instead of silently working around it, and ask how to proceed

### Step 4. Tests

Add or update unit tests for UI components with actual logic (forms, interactive widgets) and for extracted helpers/hooks, per the guide's "Тестирование" section. Purely presentational components without branching or handlers don't need tests.

### Step 5. Documentation

If the change adds/removes/renames a skill, command, MCP server, agent, hook, or route — update the relevant tables in [`CLAUDE.md`](../../../CLAUDE.md) and cross-references in [`docs/README.md`](../../../docs/README.md) in the same pass, per the "Правило актуализации" rule in `CLAUDE.md`.

### Step 6. Stop for review

Once every plan point is implemented and passes lint/typecheck/tests:

- Print a short summary of what was implemented, per plan point
- Do **not** call the `git-commit` skill and do **not** run `git commit` — hand the decision to the user explicitly, e.g.:
  > Implementation complete, all checks pass. Review the diff; run `/git-commit` yourself when ready.
