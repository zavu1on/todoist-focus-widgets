import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/shared/ui";
import type { FilterCardViewModel } from "../model/getFilterCardViewModel";

type FilterCardProps = {
  viewModel: FilterCardViewModel;
};

const TITLE_LINE_HEIGHT = 15;

export const FilterCard: FC<FilterCardProps> = ({ viewModel }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <View
        style={[
          styles.priorityBar,
          { backgroundColor: viewModel.priorityColor },
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {viewModel.taskTitle ?? "All clear."}
        </Text>
        {viewModel.projectName !== null && (
          <View style={styles.projectRow}>
            <View
              style={[
                styles.projectDot,
                { backgroundColor: viewModel.projectColor ?? "#808080" },
              ]}
            />
            <Text style={styles.projectName} numberOfLines={1}>
              {viewModel.projectName}
            </Text>
          </View>
        )}
        <View style={styles.spacer} />
        {viewModel.remainingCount > 0 && (
          <Text style={styles.remainingCount}>
            +{viewModel.remainingCount} more
          </Text>
        )}
      </View>
    </View>
    <Text style={styles.filterTitle} numberOfLines={1}>
      {viewModel.filterTitle}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  card: {
    height: 92,
    borderRadius: 16,
    backgroundColor: "#FEFDFC",
    borderWidth: 1,
    borderColor: "#E6E1DB",
    flexDirection: "row",
    overflow: "hidden",
  },
  priorityBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 10,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.poppinsBold,
    fontSize: 11.5,
    lineHeight: TITLE_LINE_HEIGHT,
    height: TITLE_LINE_HEIGHT * 2,
    color: "#25221E",
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  projectDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  projectName: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 9,
    color: "#808080",
    flexShrink: 1,
  },
  spacer: {
    flex: 1,
  },
  remainingCount: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 8.5,
    color: "#A8A29B",
  },
  filterTitle: {
    fontFamily: fonts.dmSansBold,
    fontSize: 13,
    color: "#25221E",
  },
});
