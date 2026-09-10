import type { SQLiteDatabase } from "expo-sqlite";

export const deleteProjects = async (
  db: SQLiteDatabase,
  ids: string[],
): Promise<void> => {
  if (ids.length === 0) {
    return;
  }

  await db.runAsync(
    `DELETE FROM projects WHERE id IN (${ids.map(() => "?").join(", ")})`,
    ids,
  );
};
