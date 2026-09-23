import type { SQLiteDatabase } from "expo-sqlite";

export const getWidgetFilterIds = async (
  db: SQLiteDatabase,
): Promise<Map<number, number>> => {
  const rows = await db.getAllAsync<{ widget_id: number; filter_id: number }>(
    "SELECT widget_id, filter_id FROM widget_filter",
  );

  return new Map(rows.map((row) => [row.widget_id, row.filter_id]));
};
