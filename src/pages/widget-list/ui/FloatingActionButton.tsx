import { router } from "expo-router";
import type { FC } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, colors, fonts } from "@/shared/ui";

export const FloatingActionButton: FC = () => (
  <Button
    style={styles.fab}
    accessibilityLabel="Add widget"
    onPress={() => router.push("/filter/new")}
  >
    <Text style={styles.icon}>+</Text>
  </Button>
);

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 26,
    width: 60,
    height: 60,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  icon: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 30,
    color: colors.surface,
    lineHeight: 30,
  },
});
