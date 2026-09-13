import type { SQLiteDatabase } from "expo-sqlite";

export const clearProjects = async (db: SQLiteDatabase): Promise<void> => {
  await db.runAsync("DELETE FROM projects");
};
