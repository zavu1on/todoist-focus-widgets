import type { SQLiteDatabase } from "expo-sqlite";

export const getAndClearPendingWidgetFilterId = async (
  db: SQLiteDatabase,
): Promise<number | null> => {
  const row = await db.getFirstAsync<{ filter_id: number }>(
    "SELECT filter_id FROM pending_widget_filter WHERE id = 0",
  );

  if (row === null) {
    return null;
  }

  await db.runAsync("DELETE FROM pending_widget_filter WHERE id = 0");

  return row.filter_id;
};
