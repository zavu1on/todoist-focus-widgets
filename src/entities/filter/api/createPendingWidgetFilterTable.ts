import type { SQLiteDatabase } from "expo-sqlite";

export const createPendingWidgetFilterTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`--sql
    CREATE TABLE IF NOT EXISTS pending_widget_filter (
      id INTEGER PRIMARY KEY CHECK (id = 0),
      filter_id INTEGER NOT NULL
    );
  `);
};
