import type { SQLiteDatabase } from "expo-sqlite";

export const upsertWidgetFilterId = async (
  db: SQLiteDatabase,
  widgetId: number,
  filterId: number,
): Promise<void> => {
  await db.runAsync(
    `--sql
    INSERT OR REPLACE INTO widget_filter (widget_id, filter_id) 
    VALUES (?, ?)
    `,
    widgetId,
    filterId,
  );
};
