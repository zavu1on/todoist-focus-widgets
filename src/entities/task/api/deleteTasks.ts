import type { SQLiteDatabase } from "expo-sqlite";

export const deleteTasks = async (
  db: SQLiteDatabase,
  ids: string[],
): Promise<void> => {
  if (ids.length === 0) {
    return;
  }

  await db.runAsync(
    `DELETE FROM tasks WHERE id IN (${ids.map(() => "?").join(", ")})`,
    ids,
  );
};
