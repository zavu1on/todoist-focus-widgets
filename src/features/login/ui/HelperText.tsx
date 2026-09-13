import type { FC } from "react";
import { Linking, StyleSheet, Text } from "react-native";
import { colors, fonts } from "@/shared/ui";

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
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    lineHeight: 19.5,
    color: colors.textSecondary,
  },
  helperLink: {
    fontFamily: fonts.dmSansBold,
    color: colors.primary,
  },
});
