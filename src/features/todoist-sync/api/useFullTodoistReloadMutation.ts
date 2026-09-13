import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { clearLabels } from "@/entities/label";
import { clearProjects } from "@/entities/project";
import { clearTasks, setSyncToken } from "@/entities/task";
import { todoistSyncQueryKey } from "../model/queryKeys";

/**
 * Wipes local Todoist state (sync token + labels/projects/tasks tables) so the next
 * `useTodoistSyncQuery` refetch performs a full resync instead of a delta one. Tasks are
 * cleared before projects since `tasks.project_id` references `projects.id`.
 */
export const useFullTodoistReloadMutation = (): UseMutationResult<void> => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await setSyncToken("*");
      await clearTasks(db);
      await Promise.all([clearLabels(db), clearProjects(db)]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: todoistSyncQueryKey,
        refetchType: "none",
      });
    },
  });
};
