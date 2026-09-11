import type { FC } from "react";
import { StyleSheet, Text } from "react-native";
import { Button } from "@/shared/ui";

export const FloatingActionButton: FC = () => (
  <Button style={styles.fab} accessibilityLabel="Add widget" onPress={() => {}}>
    <Text style={styles.icon}>+</Text>
  </Button>
);

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 20,
    shadowColor: "#DB4C3F",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  icon: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 30,
    color: "#FFFFFF",
    lineHeight: 30,
  },
});
