import type { SyncResponse } from "@doist/todoist-sdk";

export type TodoistSyncProject = NonNullable<SyncResponse["projects"]>[number];
