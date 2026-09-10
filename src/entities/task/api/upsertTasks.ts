import type { SQLiteDatabase } from "expo-sqlite";
import { mapTaskToTaskRow } from "../lib/map-tasks";
import type { Task } from "../model/task";

export const upsertTasks = async (
  db: SQLiteDatabase,
  tasks: Task[],
): Promise<void> => {
  await db.withTransactionAsync(async () => {
    for (const task of tasks) {
      const row = mapTaskToTaskRow(task);

      await db.runAsync(
        `--sql
        INSERT INTO tasks (id, content, project_id, priority, due, checked, url, labels)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          content = excluded.content,
          project_id = excluded.project_id,
          priority = excluded.priority,
          due = excluded.due,
          checked = excluded.checked,
          url = excluded.url,
          labels = excluded.labels
        `,
        row.id,
        row.content,
        row.project_id,
        row.priority,
        row.due,
        row.checked,
        row.url,
        row.labels,
      );
    }
  });
};
