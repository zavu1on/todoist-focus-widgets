import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, colors, fonts } from "@/shared/ui";
import type { FilterCardViewModel } from "../models/getFilterCardViewModel";

type FilterCardProps = {
  viewModel: FilterCardViewModel;
  onPress?: () => void;
  onLongPress?: () => void;
};

const TITLE_LINE_HEIGHT = 15;

export const FilterCard: FC<FilterCardProps> = ({
  viewModel,
  onPress,
  onLongPress,
}) => {
  const content = (
    <>
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
                  {
                    backgroundColor:
                      viewModel.projectColor ?? colors.textSecondary,
                  },
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
    </>
  );

  if (onPress === undefined) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <Button
      style={styles.container}
      accessibilityLabel={viewModel.filterTitle}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {content}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    height: undefined,
    borderRadius: 0,
    backgroundColor: "transparent",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  card: {
    height: 92,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.divider,
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
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    flexShrink: 1,
  },
  spacer: {
    flex: 1,
  },
  remainingCount: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 8.5,
    color: colors.textMuted,
  },
  filterTitle: {
    fontFamily: fonts.dmSansBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
});
