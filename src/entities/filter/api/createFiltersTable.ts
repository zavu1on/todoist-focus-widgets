import type { SQLiteDatabase } from "expo-sqlite";

export type FilterRow = {
  id: number;
  title: string;
  query: string;
  last_update: string;
};

export const createFiltersTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`--sql
    CREATE TABLE IF NOT EXISTS filters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      query TEXT NOT NULL,
      last_update TEXT NOT NULL
    );
  `);
};
