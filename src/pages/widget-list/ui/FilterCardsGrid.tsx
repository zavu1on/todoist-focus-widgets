import type { FC } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import type { FilterCardViewModel } from "../model/getFilterCardViewModel";
import { FilterCard } from "./FilterCard";

type FilterCardsGridProps = {
  viewModels: FilterCardViewModel[];
};

const renderItem = ({ item }: { item: FilterCardViewModel }) => (
  <View style={styles.cell}>
    <FilterCard viewModel={item} />
  </View>
);

const keyExtractor = (item: FilterCardViewModel) => item.filterId.toString();

export const FilterCardsGrid: FC<FilterCardsGridProps> = ({ viewModels }) => (
  <FlatList
    data={viewModels}
    numColumns={2}
    columnWrapperStyle={styles.row}
    contentContainerStyle={styles.content}
    renderItem={renderItem}
    keyExtractor={keyExtractor}
  />
);

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 22,
  },
  row: {
    gap: 16,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
});
