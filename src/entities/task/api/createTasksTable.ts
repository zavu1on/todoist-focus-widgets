import type { SQLiteDatabase } from "expo-sqlite";

export type TaskRow = {
  id: string;
  content: string;
  project_id: string;
  priority: number;
  due: string | null;
  checked: number;
  url: string;
  labels: string;
};

export const createTasksTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`--sql
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      project_id TEXT NOT NULL REFERENCES projects(id),
      priority INTEGER NOT NULL,
      due TEXT,
      checked INTEGER NOT NULL,
      url TEXT NOT NULL,
      labels TEXT NOT NULL
    );
  `);
};
