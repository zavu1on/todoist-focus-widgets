import type { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { type CreateFilterInput, PRIORITY_COLORS } from "@/entities/filter";
import { type Priority, priorityVariants } from "@/entities/task";
import { Button, colors, fonts } from "@/shared/ui";

export const PrioritySelectField: FC = () => {
  const { control } = useFormContext<CreateFilterInput>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Priority</Text>
      <Controller
        control={control}
        name="queryInput.priorities"
        render={({ field: { value, onChange } }) => {
          const toggle = (priority: Priority) => {
            onChange(
              value.includes(priority)
                ? value.filter((selected) => selected !== priority)
                : [...value, priority],
            );
          };

          return (
            <View style={styles.row}>
              {priorityVariants.map((variant) => {
                const isSelected = value.includes(variant.value);
                const color = PRIORITY_COLORS[variant.value];

                return (
                  <Button
                    key={variant.value}
                    accessibilityLabel={variant.label}
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.chip,
                      isSelected
                        ? { backgroundColor: color, borderColor: color }
                        : styles.chipUnselected,
                    ]}
                    onPress={() => toggle(variant.value)}
                  >
                    <Text
                      style={[
                        styles.chipLabel,
                        isSelected && styles.chipLabelSelected,
                      ]}
                    >
                      {variant.label.toUpperCase()}
                    </Text>
                  </Button>
                );
              })}
            </View>
          );
        }}
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
    alignItems: "center",
    justifyContent: "center",
  },
  chipUnselected: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipLabel: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    fontFamily: fonts.dmSansBold,
    color: colors.surface,
  },
});
