import type { SQLiteDatabase } from "expo-sqlite";

export type ProjectRow = {
  id: string;
  name: string;
  color: string;
};

export const createProjectsTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`--sql
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL
    );
  `);
};
