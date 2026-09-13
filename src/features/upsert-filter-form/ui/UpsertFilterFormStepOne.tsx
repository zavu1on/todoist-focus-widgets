import type { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, colors, fonts } from "@/shared/ui";
import { ConcatenatorToggleField } from "./ConcatenatorToggleField";
import { DueSegmentedField } from "./DueSegmentedField";
import { LabelsComboboxField } from "./LabelsComboboxField";
import { PrioritySelectField } from "./PrioritySelectField";
import { ProjectSelectField } from "./ProjectSelectField";

type UpsertFilterFormStepOneProps = {
  onBack: () => void;
  onContinue: () => void;
};

export const UpsertFilterFormStepOne: FC<UpsertFilterFormStepOneProps> = ({
  onBack,
  onContinue,
}) => (
  <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
    <View style={styles.header}>
      <Button
        style={styles.backButton}
        accessibilityLabel="Cancel"
        onPress={onBack}
      >
        <Text style={styles.backIcon}>←</Text>
      </Button>
      <Text style={styles.stepIndicator}>Step 1 of 2</Text>
    </View>

    <Text style={styles.title}>Which tasks?</Text>
    <Text style={styles.subtitle}>Every field is optional.</Text>

    <ScrollView
      style={styles.form}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
    >
      <ProjectSelectField />
      <PrioritySelectField />
      <DueSegmentedField />
      <LabelsComboboxField />
      <ConcatenatorToggleField />
    </ScrollView>

    <View style={styles.footer}>
      <Button label="Continue" onPress={onContinue} />
    </View>
  </SafeAreaView>
);

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
  },
  subtitle: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 20,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 24,
    gap: 20,
    paddingBottom: 24,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#EBE6E0",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
