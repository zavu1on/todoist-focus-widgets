import type { SQLiteDatabase } from "expo-sqlite";

export type LabelRow = {
  id: string;
  name: string;
  color: string;
};

export const createLabelsTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`--sql
    CREATE TABLE IF NOT EXISTS labels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL
    );
  `);
};
