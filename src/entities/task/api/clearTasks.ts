import type { SQLiteDatabase } from "expo-sqlite";

export const clearTasks = async (db: SQLiteDatabase): Promise<void> => {
  await db.runAsync("DELETE FROM tasks");
};
