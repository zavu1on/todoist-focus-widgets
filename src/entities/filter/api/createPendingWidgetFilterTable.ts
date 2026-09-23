import type { SQLiteDatabase } from "expo-sqlite";

/** Bridges the filter create/edit form and widgetTaskHandler */
export const createPendingWidgetFilterTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`--sql
    CREATE TABLE IF NOT EXISTS pending_widget_filter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filter_id INTEGER NOT NULL
    );
  `);
};
