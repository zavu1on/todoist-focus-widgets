import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type { SQLiteDatabase } from "expo-sqlite";
import { useEffect } from "react";
import { AppState } from "react-native";
import { getAccessToken } from "@/shared/api";
import { useDatabase } from "@/shared/model";
import { reRenderPinWidgets } from "../api/reRenderPinWidgets";
import { syncTodoistDataQuietly } from "../api/syncTodoistDataQuietly";

const revalidate = async (
  db: SQLiteDatabase,
  queryClient: QueryClient,
): Promise<void> => {
  const accessToken = await getAccessToken();

  if (accessToken !== null) {
    await syncTodoistDataQuietly(db, queryClient, accessToken);
  }

  await reRenderPinWidgets(db);
};

export const useRevalidateWidgetsOnForeground = (): void => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        revalidate(db, queryClient);
      }
    });

    return () => subscription.remove();
  }, [db, queryClient]);
};
