// biome-ignore lint/style/noRestrictedImports: sole owner of the SQLite connection
import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import {
  createFiltersTable,
  createPendingWidgetFilterTable,
  createWidgetFilterTable,
} from "@/entities/filter";
import { createLabelsTable } from "@/entities/label";
import { createProjectsTable } from "@/entities/project";
import { createTasksTable } from "@/entities/task";
import { DATABASE_NAME } from "@/shared/api";

const runMigrations = async (db: SQLiteDatabase) => {
  await db.execAsync("PRAGMA foreign_keys = ON;");

  // filter entity
  await createFiltersTable(db);
  await createPendingWidgetFilterTable(db);
  await createWidgetFilterTable(db);

  // todoist entities
  await createProjectsTable(db);
  await createLabelsTable(db);
  await createTasksTable(db);
};

let dbPromise: Promise<SQLiteDatabase> | null = null;

/**
 * Opens the single SQLite connection for the whole JS runtime and runs migrations.
 * Never call `closeAsync()` on the returned database: a second `openDatabaseAsync`
 * call for the same file reuses the native connection. So closing one JS wrapper
 * frees the native handle out from under any other wrapper referencing it.
 */
export const getDatabase = (): Promise<SQLiteDatabase> => {
  dbPromise ??= openDatabaseAsync(DATABASE_NAME)
    .then(async (db) => {
      await runMigrations(db);
      return db;
    })
    .catch((error) => {
      dbPromise = null;
      throw error;
    });

  return dbPromise;
};
