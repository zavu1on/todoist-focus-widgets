import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { colors } from "./colors";
import { fonts } from "./fonts";

type ErrorScreenProps = {
  title: string;
  details?: string;
  onRetry: () => void;
};

/** A dead end with a way out: the message, an optional cause and a retry button. */
export const ErrorScreen: FC<ErrorScreenProps> = ({
  title,
  details,
  onRetry,
}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {details !== undefined && <Text style={styles.details}>{details}</Text>}
    <Button label="Try again" onPress={onRetry} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.dmSansBold,
    fontSize: 15,
    color: colors.danger,
    textAlign: "center",
  },
  details: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
});
