import type { SQLiteDatabase } from "expo-sqlite";

export const clearLabels = async (db: SQLiteDatabase): Promise<void> => {
  await db.runAsync("DELETE FROM labels");
};
