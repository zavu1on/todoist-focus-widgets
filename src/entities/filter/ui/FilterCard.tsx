import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, colors, fonts } from "@/shared/ui";
import type { FilterCardViewModel } from "../models/getFilterCardViewModel";

type FilterCardProps = {
  viewModel: FilterCardViewModel;
  onPress?: () => void;
  onLongPress?: () => void;
};

export const FilterCard: FC<FilterCardProps> = ({
  viewModel,
  onPress,
  onLongPress,
}) => {
  const content = (
    <>
      <View
        style={[styles.topBar, { backgroundColor: viewModel.priorityColor }]}
      />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.filterTitle} numberOfLines={1}>
            {viewModel.filterTitle}
          </Text>
          {viewModel.remainingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>+{viewModel.remainingCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.divider} />
        <Text style={styles.taskTitle} numberOfLines={2}>
          {viewModel.taskTitle ?? "All clear."}
        </Text>
        <View
          style={[
            styles.projectRow,
            viewModel.projectName === null && styles.hidden,
          ]}
        >
          <View
            style={[
              styles.projectDot,
              {
                backgroundColor: viewModel.projectColor ?? colors.textSecondary,
              },
            ]}
          />
          <Text style={styles.projectName} numberOfLines={1}>
            {viewModel.projectName ?? ""}
          </Text>
        </View>
      </View>
    </>
  );

  if (onPress === undefined) {
    return <View style={styles.card}>{content}</View>;
  }

  return (
    <Button
      style={styles.card}
      accessibilityLabel={viewModel.filterTitle}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {content}
    </Button>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: undefined,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "stretch",
    justifyContent: "flex-start",
    overflow: "hidden",
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topBar: {
    height: 6,
  },
  content: {
    padding: 14,
    paddingTop: 13,
    gap: 10,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  filterTitle: {
    flex: 1,
    fontFamily: fonts.poppinsBold,
    fontSize: 14,
    minHeight: 22,
    color: colors.textPrimary,
  },
  badge: {
    height: 22,
    minWidth: 22,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: fonts.dmSansBold,
    fontSize: 12,
    color: colors.iconMuted,
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEBE5",
  },
  taskTitle: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 40,
    color: colors.textPrimary,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
  },
  hidden: {
    opacity: 0,
  },
  projectDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  projectName: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 12.5,
    color: colors.textSecondary,
    flexShrink: 1,
  },
});
