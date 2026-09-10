import { Redirect, Stack } from "expo-router";
import { type SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { createFiltersTable } from "@/entities/filter";
import { createLabelsTable } from "@/entities/label";
import { createProjectsTable } from "@/entities/project";
import { createTasksTable } from "@/entities/task";
import { useSession } from "@/shared/model";

const createDBMigrations = async (db: SQLiteDatabase) => {
  await db.execAsync("PRAGMA foreign_keys = ON;");

  // filter entity
  await createFiltersTable(db);

  // todoist entities
  await createProjectsTable(db);
  await createLabelsTable(db);
  await createTasksTable(db);
};

export default function AppLayout() {
  const { hasToken } = useSession();

  if (hasToken === null) {
    return null;
  }

  if (!hasToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SQLiteProvider databaseName="focus-widgets.db" onInit={createDBMigrations}>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      />
    </SQLiteProvider>
  );
}
