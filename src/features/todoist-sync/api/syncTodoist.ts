import { type SyncResourceType, TodoistApi } from "@doist/todoist-sdk";
import { getSyncToken, type TodoistSyncResult } from "@/entities/task";

const SYNC_RESOURCE_TYPES: SyncResourceType[] = ["labels", "projects", "items"];

/**
 * Syncs labels, projects and items (active, non-deleted tasks) with Todoist.
 * Returns the new sync token; the caller is responsible for persisting it once the
 * synced data has been saved locally.
 */
export const syncTodoist = async (
  accessToken: string,
): Promise<TodoistSyncResult> => {
  const syncToken = await getSyncToken();
  const response = await new TodoistApi(accessToken).sync({
    syncToken,
    resourceTypes: SYNC_RESOURCE_TYPES,
  });

  if (!response.syncToken) {
    throw new Error("Todoist sync response is missing a sync token.");
  }

  const data = {
    syncToken: response.syncToken,
    labels: response.labels ?? [],
    projects: response.projects ?? [],
    items: response.items ?? [],
  };

  return response.fullSync
    ? { type: "full", ...data }
    : { type: "delta", ...data };
};
