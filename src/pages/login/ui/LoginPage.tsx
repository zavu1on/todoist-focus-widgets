import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "@/features/login";
import { colors, fonts } from "@/shared/ui";

export const LoginPage: FC = () => (
  <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
    <View style={styles.logoMark}>
      <View style={styles.logoMarkInner} />
    </View>

    <Text style={styles.title}>Connect your{"\n"}Todoist account</Text>
    <Text style={styles.subtitle}>
      Focus Widget reads your tasks through a personal API token. Nothing is
      stored on a server.
    </Text>

    <LoginForm />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  logoMarkInner: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: colors.surface,
  },
  title: {
    fontFamily: fonts.poppinsBold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
    letterSpacing: -0.56,
  },
  subtitle: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.textSecondary,
    marginTop: 12,
    maxWidth: 300,
  },
});
