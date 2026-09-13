import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button, colors, fonts } from "@/shared/ui";
import { useLoginMutation } from "../api/useLoginMutation";
import {
  type LoginFormValues,
  loginFormSchema,
} from "../model/loginFormSchema";
import { HelperText } from "./HelperText";

export const LoginForm: FC = () => {
  const [isTokenFieldFocused, setIsTokenFieldFocused] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { accessToken: "" },
  });
  const loginMutation = useLoginMutation();

  const onSubmit = handleSubmit(({ accessToken }) =>
    loginMutation.mutate(accessToken),
  );

  const fieldErrorMessage =
    errors.accessToken?.message ??
    (loginMutation.isError ? loginMutation.error.message : null);

  return (
    <View style={styles.container}>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>API Token</Text>
        <Controller
          control={control}
          name="accessToken"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              accessibilityLabel="API token"
              style={[styles.input, isTokenFieldFocused && styles.inputFocused]}
              placeholder="Paste your API token"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onFocus={() => setIsTokenFieldFocused(true)}
              onBlur={() => {
                setIsTokenFieldFocused(false);
                onBlur();
              }}
            />
          )}
        />

        <HelperText />

        {fieldErrorMessage && (
          <Text style={styles.errorText}>{fieldErrorMessage}</Text>
        )}
      </View>

      <View style={styles.spacer} />

      <Button
        label="Connect"
        onPress={onSubmit}
        loading={loginMutation.isPending}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldGroup: {
    marginTop: 36,
    gap: 8,
  },
  fieldLabel: {
    fontFamily: fonts.dmSansBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  errorText: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.danger,
  },
  spacer: {
    flex: 1,
  },
});
