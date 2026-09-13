import type { FC } from "react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { CreateFilterInput } from "@/entities/filter";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { Button, colors, fonts } from "@/shared/ui";

export const LabelsComboboxField: FC = () => {
  const { control } = useFormContext<CreateFilterInput>();
  const syncQuery = useTodoistSyncQuery();
  const labels = syncQuery.data?.labels ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Labels</Text>
      <Controller
        control={control}
        name="queryInput.labels"
        render={({ field: { value, onChange } }) => {
          const toggleLabel = (labelName: string) => {
            onChange(
              value.includes(labelName)
                ? value.filter((selected) => selected !== labelName)
                : [...value, labelName],
            );
          };

          return (
            <>
              <View style={styles.chipsRow}>
                {value.map((labelName) => (
                  <View key={labelName} style={styles.chip}>
                    <Text style={styles.chipLabel}>@{labelName}</Text>
                    <Button
                      style={styles.chipRemoveButton}
                      accessibilityLabel={`Remove ${labelName}`}
                      onPress={() => toggleLabel(labelName)}
                    >
                      <Text style={styles.chipRemove}>×</Text>
                    </Button>
                  </View>
                ))}
                <Button
                  style={styles.addButton}
                  accessibilityLabel="Add label"
                  onPress={() => setIsModalOpen(true)}
                >
                  <Text style={styles.addButtonLabel}>+ Add label</Text>
                </Button>
              </View>

              <Modal
                visible={isModalOpen}
                animationType="slide"
                transparent
                onRequestClose={() => setIsModalOpen(false)}
              >
                <Pressable
                  style={styles.backdrop}
                  accessibilityLabel="Close label list"
                  onPress={() => setIsModalOpen(false)}
                />
                <View style={styles.sheet}>
                  <Text style={styles.sheetTitle}>Labels</Text>
                  <FlatList
                    data={labels}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      const isSelected = value.includes(item.name);

                      return (
                        <Button
                          style={styles.option}
                          accessibilityState={{ selected: isSelected }}
                          onPress={() => toggleLabel(item.name)}
                        >
                          <Text style={styles.optionLabel}>{item.name}</Text>
                          {isSelected && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </Button>
                      );
                    }}
                  />
                </View>
              </Modal>
            </>
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
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.textPrimary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chipLabel: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13.5,
    color: colors.surface,
  },
  chipRemoveButton: {
    height: undefined,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  chipRemove: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13.5,
    color: colors.surface,
    opacity: 0.55,
  },
  addButton: {
    height: 36,
    minWidth: 120,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D6D0C9",
    backgroundColor: colors.surface,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  addButtonLabel: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13.5,
    color: colors.textSecondary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(37,34,30,0.4)",
  },
  sheet: {
    maxHeight: "60%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sheetTitle: {
    fontFamily: fonts.poppinsBold,
    fontSize: 18,
    color: colors.textPrimary,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  optionLabel: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  checkmark: {
    fontFamily: fonts.poppinsBold,
    fontSize: 15,
    color: colors.primary,
  },
});
