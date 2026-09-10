import type { SQLiteDatabase } from "expo-sqlite";

export const deleteLabels = async (
  db: SQLiteDatabase,
  ids: string[],
): Promise<void> => {
  if (ids.length === 0) {
    return;
  }

  await db.runAsync(
    `DELETE FROM labels WHERE id IN (${ids.map(() => "?").join(", ")})`,
    ids,
  );
};
