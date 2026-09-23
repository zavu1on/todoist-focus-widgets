// biome-ignore lint/style/noRestrictedImports: mocking the sole owner's dependency
import { openDatabaseAsync } from "expo-sqlite";
import { getDatabase } from "./getDatabase";

jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn().mockResolvedValue({
    execAsync: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock("@/entities/filter", () => ({
  createFiltersTable: jest.fn().mockResolvedValue(undefined),
  createPendingWidgetFilterTable: jest.fn().mockResolvedValue(undefined),
  createWidgetFilterTable: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/entities/label", () => ({
  createLabelsTable: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/entities/project", () => ({
  createProjectsTable: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/entities/task", () => ({
  createTasksTable: jest.fn().mockResolvedValue(undefined),
}));

describe("getDatabase", () => {
  it("opens the connection exactly once for concurrent calls and runs migrations first", async () => {
    const [db] = await Promise.all([
      getDatabase(),
      getDatabase(),
      getDatabase(),
    ]);

    expect(openDatabaseAsync).toHaveBeenCalledTimes(1);
    expect(db.execAsync).toHaveBeenCalledWith("PRAGMA foreign_keys = ON;");
  });

  it("retries opening after a failed attempt instead of caching the rejection", async () => {
    await jest.isolateModulesAsync(async () => {
      const sqlite = require("expo-sqlite");
      const { getDatabase: getDatabaseIsolated } = require("./getDatabase");

      sqlite.openDatabaseAsync.mockClear();
      sqlite.openDatabaseAsync.mockRejectedValueOnce(
        new Error("disk I/O error"),
      );

      await expect(getDatabaseIsolated()).rejects.toThrow("disk I/O error");
      await expect(getDatabaseIsolated()).resolves.toBeDefined();
      expect(sqlite.openDatabaseAsync).toHaveBeenCalledTimes(2);
    });
  });
});
