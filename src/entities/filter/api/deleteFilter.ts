import type { SQLiteDatabase } from "expo-sqlite";

export const deleteFilter = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  await db.runAsync("DELETE FROM filters WHERE id = ?", id);
  await db.runAsync("DELETE FROM widget_filter WHERE filter_id = ?", id);
};
