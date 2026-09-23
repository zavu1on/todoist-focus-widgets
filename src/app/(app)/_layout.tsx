import { Redirect, Stack } from "expo-router";
import { getDatabase } from "@/features/database";
import { DatabaseProvider, useSession } from "@/shared/model";
import { colors } from "@/shared/ui";
import { useRevalidateWidgetsOnForeground } from "@/widgets/pin-widget";

const AppStack = () => {
  useRevalidateWidgetsOnForeground();

  return (
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
  );
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
    <DatabaseProvider getDatabase={getDatabase}>
      <AppStack />
    </DatabaseProvider>
  );
}
