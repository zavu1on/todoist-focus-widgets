import type { SQLiteDatabase } from "expo-sqlite";

export const setPendingWidgetFilterId = async (
  db: SQLiteDatabase,
  filterId: number,
): Promise<void> => {
  await db.runAsync(
    "INSERT OR REPLACE INTO pending_widget_filter (id, filter_id) VALUES (0, ?)",
    filterId,
  );
};
