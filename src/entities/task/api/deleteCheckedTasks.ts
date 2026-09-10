import type { SQLiteDatabase } from "expo-sqlite";

export const deleteCheckedTasks = async (db: SQLiteDatabase): Promise<void> => {
  await db.runAsync("DELETE FROM tasks WHERE checked = 1");
};
