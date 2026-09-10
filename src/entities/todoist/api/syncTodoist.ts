import { type SyncResourceType, TodoistApi } from "@doist/todoist-sdk";
import type { TodoistSyncResult } from "../model/todoist-sync-result";
import { getSyncToken } from "./getSyncToken";
import { setSyncToken } from "./setSyncToken";

const SYNC_RESOURCE_TYPES: SyncResourceType[] = ["labels", "projects", "items"];

/**
 * Syncs labels, projects and items (active, non-deleted tasks) with Todoist.
 * Persists the returned sync token so the next call fetches only the delta.
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

  await setSyncToken(response.syncToken);

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
