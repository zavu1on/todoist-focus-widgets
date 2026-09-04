---
name: git-commit
description: Generates a conventional commit message from staged changes, the current chat session and an optional argument — past-tense English verbs, bulleted body — then commits after confirmation.
---

# Git Commit

Analyzes **staged changes**, the **current chat session** (what was discussed and implemented) and an **optional argument**, builds a conventional commit message per project rules, and commits after confirmation.

## Commit format

```
type(scope): past-tense-verb short summary

- past-tense-verb specific detail
- past-tense-verb specific detail
```

**Mandatory rules:**
- Language — strictly **English**. B2-level vocabulary
- Verbs — **past tense**: `created`, `added`, `fixed`, `removed`, `updated`, `refactored`, `moved`, `renamed`, `deleted`, `implemented`, `extracted`, `configured`, `changed`, `replaced`, `improved`
- `type` — one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- `scope` — optional, only if it adds meaning (e.g. `widgets`, `auth`, `filters`); without scope — `type: verb summary`
- Title — concise, up to 72 chars
- Body — bulleted list (`-`), each item starts with a past-tense verb
- Body is **required** if more than one file is affected or the change is non-trivial
- Body is **not needed** if the change is a single file and the title fully describes it
- Body is **terse**: max 4 items, one item = one logical action, not one file
  - Group similar changes into one item (e.g. several new doc files → one item `added docs for X, Y, Z`, not one item per file)
  - Don't list files line by line — describe the essence of the change, not a path list
  - Don't repeat in the body what the title already says
  - If grouping leaves one item that just duplicates the title, drop the body entirely

**Examples:**

```
docs: created initial docs/ structure for docs-as-code pattern
- created ENTITIES.md
- created mock decision files for ADR pattern
```

```
feat(widgets): added Pin widget rendering
- added FlexWidget layout for the Pin widget type
- added empty-state placeholder for filters with no matching tasks
```

```
fix: removed duplicate index on filters table
```

## Argument

The command may be called with an argument: `/git-commit [argument]`. The argument is free text and can serve two purposes at once, both optional:

1. **Extra context for the message** — a hint, a summary, a detail the diff alone doesn't show. Fold it into the generated message instead of quoting it verbatim.
2. **AI-authorship declaration** — if the argument explicitly states that this commit (or the underlying change) was implemented with the help of an AI agent/Claude/Claude Code (e.g. "written by AI", "with Claude", "AI-assisted"), treat that as `ai_authored = true` for Step 4.

If no argument is passed, `ai_authored = false` — do **not** infer AI authorship from the fact that this session itself is a Claude Code session. Silence on the topic means no attribution trailer.

## Pipeline

Follow the steps strictly in order.

---

### Step 1. Check staged changes

Run both commands:

```bash
git status --short
git diff --staged
```

If there are **no** staged changes (`git diff --staged` output is empty) — report:
> No staged changes. Add files with `git add <file>` and call the skill again.

Stop. Don't analyze unstaged changes.

---

### Step 2. Gather context

Combine three sources to understand the change:

1. `git diff --staged` — the ground truth for *what* changed
2. The current chat session — *why* the change was made, decisions taken along the way, anything discussed that doesn't show up in the diff itself (e.g. rejected alternatives, the original request)
3. The passed argument, if any — see **Argument** above

---

### Step 3. Determine AI authorship

Check whether the argument explicitly states the change was implemented with an AI agent's help (see **Argument**). Set `ai_authored` accordingly. Default is `false` when no argument is given or the argument doesn't mention it.

---

### Step 4. Build the commit message

Based on the combined context from Step 2:

1. Determine the **type**: what kind of change is it — new feature, fix, docs, refactor?
2. Determine the **scope** (if relevant): which area of the system is affected?
3. Write the **title**: `type(scope): verb summary` or `type: verb summary` — concise, up to 72 chars
4. Build the **body**: group changes by meaning and describe each group in one item (max 4 items, no file listing)

Type selection rule:
- `feat` — new functionality for a user/system
- `fix` — bug fix
- `docs` — documentation-only changes
- `refactor` — refactoring with no functional change
- `chore` — maintenance: dependencies, configs, scripts
- `test` — added or changed tests
- `style` — formatting, whitespace (no logic change)
- `ci` — CI/CD pipeline changes
- `build` — build system changes

If `ai_authored` is `true`, append a trailing blank line followed by the attribution trailers required for this session (see the session's attribution instructions for the exact lines). If `ai_authored` is `false`, add **no** attribution trailer at all.

---

### Step 5. Show the message and ask for confirmation

Print the proposed commit in a code block and ask:

```
Proposed commit:

───────────────────────────────────
docs: created initial docs/ structure
- created ENTITIES.md
- created mock decision files for ADR pattern
───────────────────────────────────

Commit it? [yes / no / edit]
```

User response options:
- **yes** / **y** / **да** — proceed to Step 6
- **no** / **n** / **нет** — stop, don't commit, report that the operation was cancelled
- **edit** / any clarification — apply the edits, adjust the message, show it again

---

### Step 6. Commit

Run `git commit` with a multiline message via HEREDOC:

```bash
git commit -m "$(cat <<'COMMIT_MSG'
type(scope): verb summary

- verb detail 1
- verb detail 2
COMMIT_MSG
)"
```

After running:
- If the commit succeeded — print the hash and the first line of the message
- If the commit failed (pre-commit hook, error) — print the error text and **don't** retry the commit; tell the user what needs fixing
