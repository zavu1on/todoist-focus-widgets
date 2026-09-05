import { Redirect, Stack } from "expo-router";
import { useSession } from "@/shared/model";

export default function AppLayout() {
  const { hasToken } = useSession();

  if (hasToken === null) {
    return null;
  }

  if (!hasToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    />
  );
}
