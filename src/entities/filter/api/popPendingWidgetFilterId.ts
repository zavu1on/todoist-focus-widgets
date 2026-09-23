import type { SQLiteDatabase } from "expo-sqlite";

export const popPendingWidgetFilterId = async (
  db: SQLiteDatabase,
): Promise<number | null> => {
  const row = await db.getFirstAsync<{ filter_id: number }>(`--sql
    DELETE FROM pending_widget_filter
    WHERE id = (SELECT MIN(id) FROM pending_widget_filter)
    RETURNING filter_id;
  `);

  return row === null ? null : row.filter_id;
};
