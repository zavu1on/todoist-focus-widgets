import type { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import type { CreateFilterInput, QueryConcatenator } from "@/entities/filter";
import { QueryConcatenator as QueryConcatenatorValues } from "@/entities/filter";
import { Button, colors, fonts } from "@/shared/ui";

const OPTIONS: { label: string; value: QueryConcatenator }[] = [
  { label: "Match all (AND)", value: QueryConcatenatorValues.AND },
  { label: "Match any (OR)", value: QueryConcatenatorValues.OR },
];

export const ConcatenatorToggleField: FC = () => {
  const { control } = useFormContext<CreateFilterInput>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Combine fields with</Text>
      <Controller
        control={control}
        name="queryInput.concatenator"
        render={({ field: { value, onChange } }) => (
          <View style={styles.row}>
            {OPTIONS.map((option) => {
              const isSelected = value === option.value;

              return (
                <Button
                  key={option.value}
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: isSelected }}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => onChange(option.value)}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      isSelected && styles.chipLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Button>
              );
            })}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.dmSansBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipLabel: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13.5,
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    fontFamily: fonts.dmSansBold,
    color: colors.surface,
  },
});
