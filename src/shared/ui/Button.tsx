import type { FC } from "react";
import {
  ActivityIndicator,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button: FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}) => (
  <Pressable
    accessibilityRole="button"
    style={({ pressed }) => [
      styles.button,
      pressed && styles.buttonPressed,
      style,
    ]}
    android_ripple={{ color: "rgba(255, 255, 255, 0.25)" }}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator color="#FFFFFF" />
    ) : (
      <Text style={styles.label}>{label}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#DB4C3F",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "#B93A2F",
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
