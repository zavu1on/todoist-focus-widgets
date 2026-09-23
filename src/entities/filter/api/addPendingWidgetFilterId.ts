import type { SQLiteDatabase } from "expo-sqlite";

export const addPendingWidgetFilterId = async (
  db: SQLiteDatabase,
  filterId: number,
): Promise<void> => {
  await db.runAsync(
    "INSERT INTO pending_widget_filter (filter_id) VALUES (?)",
    filterId,
  );
};
