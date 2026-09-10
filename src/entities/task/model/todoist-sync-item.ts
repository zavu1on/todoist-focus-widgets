import type { SyncResponse } from "@doist/todoist-sdk";

export type TodoistSyncItem = NonNullable<SyncResponse["items"]>[number];
