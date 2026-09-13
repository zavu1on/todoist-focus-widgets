import { useFocusEffect } from "expo-router";
import type { FC } from "react";
import { useCallback } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFilterCardViewModel, useFiltersQuery } from "@/entities/filter";
import { useTodoistSyncQuery } from "@/features/todoist-sync";
import { useSession } from "@/shared/model";
import { Button, colors, fonts, SkeletonBlock } from "@/shared/ui";
import { FilterCardsGrid } from "./FilterCardsGrid";
import { FloatingActionButton } from "./FloatingActionButton";

const SKELETON_CARDS = [1, 2, 3, 4];

const getErrorCause = (error: unknown): string | undefined => {
  if (!(error instanceof Error) || error.cause === undefined) {
    return undefined;
  }

  return error.cause instanceof Error
    ? error.cause.message
    : String(error.cause);
};

export const WidgetListPage: FC = () => {
  const { signOut } = useSession();
  const filtersQuery = useFiltersQuery();
  const syncQuery = useTodoistSyncQuery();

  const isLoading = filtersQuery.isPending || syncQuery.isPending;

  const refetchFilters = filtersQuery.refetch;
  useFocusEffect(
    useCallback(() => {
      refetchFilters();
    }, [refetchFilters]),
  );

  const handleLogOut = () => {
    Alert.alert("Log out?", "You'll need to reconnect your Todoist account.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: signOut },
    ]);
  };

  const viewModels =
    filtersQuery.data && syncQuery.data
      ? filtersQuery.data.map((filter) =>
          getFilterCardViewModel({
            filterId: filter.id,
            filterTitle: filter.title,
            query: filter.query,
            tasks: syncQuery.data.tasks,
            projects: syncQuery.data.projects,
          }),
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

      {syncQuery.isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            {syncQuery.error instanceof Error
              ? syncQuery.error.message
              : "Something went wrong while syncing with Todoist."}
          </Text>
          {getErrorCause(syncQuery.error) !== undefined && (
            <Text style={styles.errorCause}>
              {getErrorCause(syncQuery.error)}
            </Text>
          )}
          <Button label="Try again" onPress={() => syncQuery.refetch()} />
        </View>
      ) : isLoading ? (
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.primary,
    marginTop: -5, // visual correction for centering the header brand
  },
  headerTitle: {
    fontFamily: fonts.poppinsBold,
    fontSize: 21,
    color: colors.textPrimary,
  },
  logOutButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  logOutIcon: {
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 18,
    color: colors.surface,
  },
  skeletonGrid: {
    flex: 1,
    padding: 24,
    gap: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  errorTitle: {
    fontFamily: fonts.dmSansBold,
    fontSize: 15,
    color: colors.danger,
    textAlign: "center",
  },
  errorCause: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 12,
  },
});
