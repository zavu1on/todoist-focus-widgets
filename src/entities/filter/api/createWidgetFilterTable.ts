import type { SQLiteDatabase } from "expo-sqlite";

/** Stores native widget ids needed to update their data */
export const createWidgetFilterTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`--sql
    CREATE TABLE IF NOT EXISTS widget_filter (
      widget_id INTEGER PRIMARY KEY,
      filter_id INTEGER NOT NULL
    );
  `);
};
