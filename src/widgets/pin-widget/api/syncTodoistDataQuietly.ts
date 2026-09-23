import type { QueryClient } from "@tanstack/react-query";
import type { SQLiteDatabase } from "expo-sqlite";
import { syncTodoistData, todoistSyncQueryKey } from "@/features/todoist-sync";

/**
 * Syncs Todoist data and swallows failures: a stale local view beats an
 * error screen on a widget, so callers just render whatever is in SQLite.
 */
export const syncTodoistDataQuietly = async (
  db: SQLiteDatabase,
  queryClient: QueryClient,
  accessToken: string,
): Promise<void> => {
  try {
    // fetchQuery deduplicates concurrent calls for the same queryKey into a
    // single in-flight request, so multiple widget instances rendering at
    // once trigger one network sync instead of one per instance.
    await queryClient.fetchQuery({
      queryKey: todoistSyncQueryKey,
      queryFn: () => syncTodoistData(db, accessToken),
      staleTime: 0,
    });
  } catch {
    // Intentionally ignored - see the doc comment above.
  }
};
