import type { FC } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CreateFilterInput } from "@/entities/filter";
import {
  FilterCard,
  FilterQuery,
  getFilterCardViewModel,
} from "@/entities/filter";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { Button, colors, fonts } from "@/shared/ui";

type UpsertFilterFormStepTwoProps = {
  onBack: () => void;
  onSubmit: () => void;
  onPlaceOnHomeScreen: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
};

export const UpsertFilterFormStepTwo: FC<UpsertFilterFormStepTwoProps> = ({
  onBack,
  onSubmit,
  onPlaceOnHomeScreen,
  onDelete,
  isSubmitting,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateFilterInput>();
  const syncQuery = useTodoistSyncQuery();
  const title = useWatch({ control, name: "title" });
  const queryInput = useWatch({ control, name: "queryInput" });

  const previewViewModel = getFilterCardViewModel({
    filterId: 0,
    filterTitle: title.trim().length > 0 ? title : "Untitled widget",
    query: FilterQuery.of(queryInput),
    tasks: syncQuery.data?.tasks ?? [],
    projects: syncQuery.data?.projects ?? [],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Button
          style={styles.backButton}
          accessibilityLabel="Back"
          onPress={onBack}
        >
          <Text style={styles.backIcon}>←</Text>
        </Button>
        <Text style={styles.stepIndicator}>Step 2 of 2</Text>
      </View>

      <Text style={styles.title}>Name it and check it</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name this widget</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange } }) => (
              <TextInput
                accessibilityLabel="Widget name"
                style={styles.input}
                placeholder="Deep work"
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Text style={styles.helperText}>
            Only shown in the hub — never on the widget itself.
          </Text>
          {errors.title?.message && (
            <Text style={styles.errorText}>{errors.title.message}</Text>
          )}
        </View>

        <View style={styles.previewGroup}>
          <Text style={styles.previewLabel}>Actual size preview</Text>
          <View style={styles.previewFrame}>
            <FilterCard viewModel={previewViewModel} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Add to Home Screen"
          onPress={onSubmit}
          onLongPress={onPlaceOnHomeScreen}
          loading={isSubmitting}
        />
        <Text style={styles.footerCaption}>
          Next: long-press your home screen → Widgets → Focus Widget
        </Text>
        {onDelete !== undefined && (
          <Button
            label="Delete filter"
            style={styles.deleteButton}
            onPress={onDelete}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  backIcon: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  stepIndicator: {
    fontFamily: fonts.dmSansBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.poppinsBold,
    fontSize: 24,
    color: colors.textPrimary,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  fieldGroup: {
    paddingHorizontal: 24,
    gap: 8,
  },
  label: {
    fontFamily: fonts.dmSansBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  helperText: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.danger,
  },
  previewGroup: {
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 10,
  },
  previewLabel: {
    fontFamily: fonts.dmSansBold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },
  previewFrame: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#EFECE8",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 10,
  },
  footerCaption: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
});
