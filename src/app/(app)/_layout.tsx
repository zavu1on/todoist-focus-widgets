import { Redirect, Stack } from "expo-router";
import { type SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { createFiltersTable } from "@/entities/filter";
import { useSession } from "@/shared/model";

const createDBMigrations = async (db: SQLiteDatabase) => {
  await createFiltersTable(db);
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
