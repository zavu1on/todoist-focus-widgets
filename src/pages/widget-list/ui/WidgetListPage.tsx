import type { FC } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/shared/model";

export const WidgetListPage: FC = () => {
  const { signOut } = useSession();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>Widgets</Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  button: {
    borderWidth: 1,
    borderColor: "#e44332",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#e44332",
    fontWeight: "600",
  },
});
