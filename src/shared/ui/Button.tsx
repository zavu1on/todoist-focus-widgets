import type { FC, ReactNode } from "react";
import {
  type AccessibilityState,
  ActivityIndicator,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import { colors } from "./colors";
import { fonts } from "./fonts";

type ButtonProps = {
  label?: string;
  children?: ReactNode;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button: FC<ButtonProps> = ({
  label,
  children,
  accessibilityLabel,
  accessibilityState,
  onPress,
  onLongPress,
  disabled = false,
  loading = false,
  style,
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? label}
    accessibilityState={accessibilityState}
    style={({ pressed }) => [
      styles.button,
      pressed && styles.buttonPressed,
      style,
    ]}
    android_ripple={{ color: "rgba(255, 255, 255, 0.25)" }}
    onPress={onPress}
    onLongPress={onLongPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator color={colors.surface} />
    ) : (
      (children ?? <Text style={styles.label}>{label}</Text>)
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  label: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 16,
    color: colors.surface,
  },
});
