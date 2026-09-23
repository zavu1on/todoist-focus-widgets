import type { SQLiteDatabase } from "expo-sqlite";

export const deleteWidgetFilterId = async (
  db: SQLiteDatabase,
  widgetId: number,
): Promise<void> => {
  await db.runAsync("DELETE FROM widget_filter WHERE widget_id = ?", widgetId);
};
