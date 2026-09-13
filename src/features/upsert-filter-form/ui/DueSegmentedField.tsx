import type { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { type CreateFilterInput, dueVariants } from "@/entities/filter";
import { Button, colors, fonts } from "@/shared/ui";

export const DueSegmentedField: FC = () => {
  const { control } = useFormContext<CreateFilterInput>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Due</Text>
      <Controller
        control={control}
        name="queryInput.due"
        render={({ field: { value, onChange } }) => (
          <View style={styles.track}>
            {dueVariants.map((variant) => {
              const isSelected = value === variant.value;

              return (
                <Button
                  key={variant.value}
                  accessibilityLabel={variant.label}
                  accessibilityState={{ selected: isSelected }}
                  style={[styles.segment, isSelected && styles.segmentSelected]}
                  onPress={() =>
                    onChange(isSelected ? undefined : variant.value)
                  }
                >
                  <Text
                    style={[
                      styles.segmentLabel,
                      isSelected && styles.segmentLabelSelected,
                    ]}
                  >
                    {variant.label}
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
  track: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    padding: 5,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
  },
  segment: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  segmentSelected: {
    backgroundColor: colors.surface,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentLabel: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  segmentLabelSelected: {
    fontFamily: fonts.dmSansBold,
    color: colors.textPrimary,
  },
});
