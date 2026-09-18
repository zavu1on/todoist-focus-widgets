import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import type { FC } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { FilterCard, type FilterCardViewModel } from "@/entities/filter";
import { pinFilterWidget } from "@/features/pin-filter-widget";
import { colors, fonts } from "@/shared/ui";

type FilterCardsGridProps = {
  viewModels: FilterCardViewModel[];
};

const CONTENT_PADDING = 20;
const COLUMN_GAP = 14;
const COLUMNS = 2;

export const FilterCardsGrid: FC<FilterCardsGridProps> = ({ viewModels }) => {
  const { width } = useWindowDimensions();
  const cardWidth =
    (width - CONTENT_PADDING * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS;
  const db = useSQLiteContext();

  const renderItem = ({ item }: { item: FilterCardViewModel }) => (
    <View style={[styles.cell, { width: cardWidth }]}>
      <FilterCard
        viewModel={item}
        onPress={() =>
          router.push({
            pathname: "/filter/[id]",
            params: { id: String(item.filterId) },
          })
        }
        onLongPress={() => pinFilterWidget(db, item.filterId)}
      />
    </View>
  );

  if (viewModels.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          No filters yet. Tap the + button to create one.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={viewModels}
      numColumns={COLUMNS}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const keyExtractor = (item: FilterCardViewModel) => item.filterId.toString();

const styles = StyleSheet.create({
  content: {
    padding: CONTENT_PADDING,
    gap: COLUMN_GAP,
  },
  row: {
    gap: COLUMN_GAP,
  },
  cell: {
    minWidth: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: CONTENT_PADDING,
  },
  emptyStateText: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
