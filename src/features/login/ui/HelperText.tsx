import type { FC } from "react";
import { Linking, StyleSheet, Text } from "react-native";

const TODOIST_TOKEN_SETTINGS_URL =
  "https://app.todoist.com/app/settings/integrations/developer";

export const HelperText: FC = () => (
  <Text style={styles.helperText}>
    Find your token in Todoist → Settings → Integrations → Developer.{" "}
    <Text
      style={styles.helperLink}
      accessibilityRole="link"
      onPress={() => Linking.openURL(TODOIST_TOKEN_SETTINGS_URL)}
    >
      Show me how
    </Text>
  </Text>
);

const styles = StyleSheet.create({
  helperText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 19.5,
    color: "#808080",
  },
  helperLink: {
    fontFamily: "DMSans_700Bold",
    color: "#DB4C3F",
  },
});
