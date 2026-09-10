import type { SyncLabel, SyncResponse } from "@doist/todoist-sdk";

export type { SyncLabel };
export type TodoistSyncItem = NonNullable<SyncResponse["items"]>[number];
export type TodoistSyncProject = NonNullable<SyncResponse["projects"]>[number];

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
