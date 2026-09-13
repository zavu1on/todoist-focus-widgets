import { Redirect, Stack } from "expo-router";
import { type SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { createFiltersTable } from "@/entities/filter";
import { createLabelsTable } from "@/entities/label";
import { createProjectsTable } from "@/entities/project";
import { createTasksTable } from "@/entities/task";
import { useSession } from "@/shared/model";
import { colors } from "@/shared/ui";

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
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          // No animation: expo-router unmounts a popped screen before its pop transition finishes.
          // It's a conscious crutch. Animation is implemented in UpsertFilterForm component.
          animation: "none",
        }}
      >
        <Stack.Screen name="filter/new" />
        <Stack.Screen name="filter/[id]" />
      </Stack>
    </SQLiteProvider>
  );
}
