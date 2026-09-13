import { router } from "expo-router";
import type { FC } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  FilterCard,
  type FilterCardViewModel,
  useDeleteFilterMutation,
} from "@/entities/filter";

type FilterCardsGridProps = {
  viewModels: FilterCardViewModel[];
};

const CONTENT_PADDING = 24;
const COLUMN_GAP = 16;
const COLUMNS = 2;

export const FilterCardsGrid: FC<FilterCardsGridProps> = ({ viewModels }) => {
  const { width } = useWindowDimensions();
  const cardWidth =
    (width - CONTENT_PADDING * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS;
  const deleteMutation = useDeleteFilterMutation();

  const handleLongPress = (item: FilterCardViewModel) => {
    Alert.alert(
      "Delete this filter?",
      `"${item.filterTitle}" will be removed from your widgets.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(item.filterId),
        },
      ],
    );
  };

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
        onLongPress={() => handleLongPress(item)}
      />
    </View>
  );

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
    gap: 22,
  },
  row: {
    gap: COLUMN_GAP,
  },
  cell: {
    minWidth: 0,
  },
});
