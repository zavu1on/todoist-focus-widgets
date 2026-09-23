import { QueryClient } from "@tanstack/react-query";
import type { SQLiteDatabase } from "expo-sqlite";
import { syncTodoistData } from "@/features/todoist-sync";
import { syncTodoistDataQuietly } from "./syncTodoistDataQuietly";

jest.mock("@/features/todoist-sync", () => ({
  syncTodoistData: jest.fn(),
  todoistSyncQueryKey: ["todoist-sync"],
}));

const fakeDb = {} as SQLiteDatabase;
const queryClient = new QueryClient();

afterEach(() => {
  jest.clearAllMocks();
  // Real queryClient.fetchQuery() schedules a garbage-collection timer per
  // query; clear the cache so it doesn't keep the process alive after tests.
  queryClient.clear();
});

describe("syncTodoistDataQuietly", () => {
  it("syncs Todoist data into SQLite", async () => {
    jest.mocked(syncTodoistData).mockResolvedValue({
      tasks: [],
      projects: [],
      labels: [],
    });

    await syncTodoistDataQuietly(fakeDb, queryClient, "token");

    expect(syncTodoistData).toHaveBeenCalledWith(fakeDb, "token");
  });

  it("swallows a failed sync instead of throwing", async () => {
    jest.mocked(syncTodoistData).mockRejectedValue(new Error("network down"));

    await expect(
      syncTodoistDataQuietly(fakeDb, queryClient, "token"),
    ).resolves.toBeUndefined();
  });
});
