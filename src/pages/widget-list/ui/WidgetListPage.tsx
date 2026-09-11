import type { FC } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFiltersQuery } from "@/entities/filter";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { useSession } from "@/shared/model";
import { Button, fonts, SkeletonBlock } from "@/shared/ui";
import { getFilterCardViewModel } from "../model/getFilterCardViewModel";
import { FilterCardsGrid } from "./FilterCardsGrid";
import { FloatingActionButton } from "./FloatingActionButton";

const SKELETON_CARDS = [1, 2, 3, 4];

export const WidgetListPage: FC = () => {
  const { signOut } = useSession();
  const filtersQuery = useFiltersQuery();
  const syncQuery = useTodoistSyncQuery();

  const isLoading = filtersQuery.isPending || syncQuery.isPending;

  const handleLogOut = () => {
    Alert.alert("Log out?", "You'll need to reconnect your Todoist account.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: signOut },
    ]);
  };

  const viewModels =
    filtersQuery.data && syncQuery.data
      ? filtersQuery.data.map((filter) =>
          getFilterCardViewModel(
            filter,
            syncQuery.data.tasks,
            syncQuery.data.projects,
          ),
        )
      : [];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.logoMark} />
          <Text style={styles.headerTitle}>Focus Widget</Text>
        </View>
        <Button
          style={styles.logOutButton}
          accessibilityLabel="Log out"
          onPress={handleLogOut}
        >
          <Text style={styles.logOutIcon}>⎋</Text>
        </Button>
      </View>

      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {SKELETON_CARDS.map((id) => (
            <SkeletonBlock key={id} height={92} borderRadius={16} />
          ))}
        </View>
      ) : (
        <FilterCardsGrid viewModels={viewModels} />
      )}

      <FloatingActionButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFDFC",
  },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#DB4C3F",
    marginTop: -5, // visual correction for centering the header brand
  },
  headerTitle: {
    fontFamily: fonts.poppinsBold,
    fontSize: 21,
    color: "#25221E",
  },
  logOutButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  logOutIcon: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: "#FFFFFF",
  },
  skeletonGrid: {
    flex: 1,
    padding: 24,
    gap: 22,
  },
});
