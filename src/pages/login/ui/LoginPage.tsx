import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "@/features/login";

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
    backgroundColor: "#FEFDFC",
    paddingTop: 40,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#DB4C3F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  logoMarkInner: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    lineHeight: 32,
    color: "#25221E",
    letterSpacing: -0.56,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22.5,
    color: "#808080",
    marginTop: 12,
    maxWidth: 300,
  },
});
