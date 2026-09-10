import type { SyncLabel } from "@/entities/label";
import type { TodoistSyncProject } from "@/entities/project";
import type { TodoistSyncItem } from "./todoist-sync-item";

type TodoistSyncData = {
  syncToken: string;
  labels: SyncLabel[];
  projects: TodoistSyncProject[];
  items: TodoistSyncItem[];
};

/** First sync for the current sync token: the server sent the full current state. */
export type TodoistFullSync = TodoistSyncData & { type: "full" };

/** Incremental sync: the server sent only what changed since the previous sync token. */
export type TodoistDeltaSync = TodoistSyncData & { type: "delta" };

export type TodoistSyncResult = TodoistFullSync | TodoistDeltaSync;
