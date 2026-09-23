import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { Label } from "@/entities/label";
import type { Project } from "@/entities/project";
import type { Task } from "@/entities/task";
import { getAccessToken } from "@/shared/api";
import { useDatabase } from "@/shared/model";
import { todoistSyncQueryKey } from "../model/queryKeys";
import { syncTodoistData } from "./syncTodoistData";

type TodoistSyncData = { tasks: Task[]; projects: Project[]; labels: Label[] };

/**
 * Syncs Todoist data into SQLite and returns the local state. Cached until manually
 * revalidated (no periodic refetch here — that's a separate feature).
 */
export const useTodoistSyncQuery = (): UseQueryResult<TodoistSyncData> => {
  const db = useDatabase();

  return useQuery({
    queryKey: todoistSyncQueryKey,
    queryFn: async () => {
      const accessToken = await getAccessToken();

      if (accessToken === null) {
        throw new Error("You need to connect your Todoist account first.");
      }

      return syncTodoistData(db, accessToken);
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
};
