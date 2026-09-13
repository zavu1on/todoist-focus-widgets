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
import { getProjectColorHex, type Project } from "@/entities/project";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { Button, colors, fonts } from "@/shared/ui";

type SelectedProject = { id: string; name: string };

export const ProjectSelectField: FC = () => {
  const { control } = useFormContext<CreateFilterInput>();
  const syncQuery = useTodoistSyncQuery();
  const projects = syncQuery.data?.projects ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Project</Text>
      <Controller
        control={control}
        name="queryInput.project"
        render={({ field: { value, onChange } }) => {
          const selectedProject = projects.find(
            (project) => project.id === value?.id,
          );

          const handleSelect = (project: Project | null) => {
            const nextValue: SelectedProject | undefined =
              project === null
                ? undefined
                : { id: project.id, name: project.name };

            onChange(nextValue);
            setIsModalOpen(false);
          };

          return (
            <>
              <Button
                accessibilityLabel="Project"
                style={styles.field}
                onPress={() => setIsModalOpen(true)}
              >
                {selectedProject !== undefined && (
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: getProjectColorHex(
                          selectedProject.color,
                        ),
                      },
                    ]}
                  />
                )}
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {selectedProject?.name ?? value?.name ?? "Not set"}
                </Text>
                <Text style={styles.chevron}>▾</Text>
              </Button>

              <Modal
                visible={isModalOpen}
                animationType="slide"
                transparent
                onRequestClose={() => setIsModalOpen(false)}
              >
                <Pressable
                  style={styles.backdrop}
                  accessibilityLabel="Close project list"
                  onPress={() => setIsModalOpen(false)}
                />
                <View style={styles.sheet}>
                  <Text style={styles.sheetTitle}>Project</Text>
                  <FlatList
                    data={projects}
                    keyExtractor={(project) => project.id}
                    ListHeaderComponent={
                      <Button
                        style={styles.option}
                        onPress={() => handleSelect(null)}
                      >
                        <Text style={styles.optionLabel}>Not set</Text>
                      </Button>
                    }
                    renderItem={({ item }) => (
                      <Button
                        style={styles.option}
                        onPress={() => handleSelect(item)}
                      >
                        <View
                          style={[
                            styles.dot,
                            { backgroundColor: getProjectColorHex(item.color) },
                          ]}
                        />
                        <Text style={styles.optionLabel}>{item.name}</Text>
                      </Button>
                    )}
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
  field: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    gap: 9,
  },
  fieldValue: {
    flex: 1,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  chevron: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
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
    justifyContent: "flex-start",
    gap: 9,
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
});
