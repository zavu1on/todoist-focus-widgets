import type { SQLiteDatabase } from "expo-sqlite";
import { syncTodoist } from "./syncTodoist";
import { syncTodoistData } from "./syncTodoistData";

jest.mock("./syncTodoist");

jest.mock("@/entities/label", () => ({
  ...jest.requireActual("@/entities/label"),
  upsertLabels: jest.fn(),
  deleteLabels: jest.fn(),
  getLabels: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/entities/project", () => {
  const actual = jest.requireActual("@/entities/project");

  return {
    ...actual,
    upsertProjects: jest.fn(),
    deleteProjects: jest.fn(),
    getProjects: jest
      .fn()
      .mockResolvedValue([
        actual.Project.create({ id: "p1", name: "Inbox", color: "red" }),
      ]),
  };
});

jest.mock("@/entities/task", () => ({
  ...jest.requireActual("@/entities/task"),
  upsertTasks: jest.fn(),
  deleteTasks: jest.fn(),
  getTasks: jest.fn().mockResolvedValue([]),
  setSyncToken: jest.fn(),
}));

import { deleteLabels, getLabels, upsertLabels } from "@/entities/label";
import {
  deleteProjects,
  getProjects,
  Project,
  upsertProjects,
} from "@/entities/project";
import {
  deleteTasks,
  getTasks,
  setSyncToken,
  upsertTasks,
} from "@/entities/task";

const db = {} as SQLiteDatabase;
const mockedSyncTodoist = syncTodoist as jest.Mock;

const syncItemFixture = {
  id: "task-1",
  projectId: "p1",
  content: "Buy milk",
  priority: 3,
  due: null,
  checked: false,
  url: "https://todoist.com/showTask?id=1",
  labels: [] as string[],
  isDeleted: false,
};

const syncLabelFixture = {
  id: "label-1",
  name: "urgent",
  color: "red",
  isFavorite: false,
  isDeleted: false,
};

const syncProjectFixture = {
  id: "p1",
  name: "Inbox",
  color: "red",
  isDeleted: false,
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("syncTodoistData / full sync", () => {
  it("upserts everything, projects before tasks", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "token",
      labels: [syncLabelFixture],
      projects: [syncProjectFixture],
      items: [syncItemFixture],
    });

    const callOrder: string[] = [];
    (upsertProjects as jest.Mock).mockImplementation(async () => {
      callOrder.push("upsertProjects");
    });
    (upsertTasks as jest.Mock).mockImplementation(async () => {
      callOrder.push("upsertTasks");
    });

    await syncTodoistData(db, "access-token");

    expect(upsertLabels).toHaveBeenCalledWith(db, [
      expect.objectContaining({ id: "label-1" }),
    ]);
    expect(upsertProjects).toHaveBeenCalledWith(db, [
      expect.objectContaining({ id: "p1" }),
    ]);
    expect(upsertTasks).toHaveBeenCalledWith(db, [
      expect.objectContaining({ id: "task-1" }),
    ]);
    expect(deleteLabels).not.toHaveBeenCalled();
    expect(deleteProjects).not.toHaveBeenCalled();
    expect(deleteTasks).not.toHaveBeenCalled();
    expect(callOrder).toEqual(["upsertProjects", "upsertTasks"]);
  });

  it("upserts empty lists and never deletes when Todoist has no data at all", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "token",
      labels: [],
      projects: [],
      items: [],
    });

    await syncTodoistData(db, "access-token");

    expect(upsertLabels).toHaveBeenCalledWith(db, []);
    expect(upsertProjects).toHaveBeenCalledWith(db, []);
    expect(upsertTasks).toHaveBeenCalledWith(db, []);
    expect(deleteLabels).not.toHaveBeenCalled();
    expect(deleteProjects).not.toHaveBeenCalled();
    expect(deleteTasks).not.toHaveBeenCalled();
  });
});

describe("syncTodoistData / delta sync", () => {
  it("partitions changed and removed entities by isDeleted", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "delta",
      syncToken: "token",
      labels: [
        syncLabelFixture,
        { ...syncLabelFixture, id: "label-2", isDeleted: true },
      ],
      projects: [syncProjectFixture],
      items: [
        syncItemFixture,
        { ...syncItemFixture, id: "task-2", isDeleted: true },
      ],
    });

    await syncTodoistData(db, "access-token");

    expect(upsertLabels).toHaveBeenCalledWith(db, [
      expect.objectContaining({ id: "label-1" }),
    ]);
    expect(deleteLabels).toHaveBeenCalledWith(db, ["label-2"]);
    expect(upsertTasks).toHaveBeenCalledWith(db, [
      expect.objectContaining({ id: "task-1" }),
    ]);
    expect(deleteTasks).toHaveBeenCalledWith(db, ["task-2"]);
  });

  it("only deletes, without upserting anything, when a delta contains solely removals", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "delta",
      syncToken: "token",
      labels: [{ ...syncLabelFixture, isDeleted: true }],
      projects: [{ ...syncProjectFixture, isDeleted: true }],
      items: [{ ...syncItemFixture, isDeleted: true }],
    });

    await syncTodoistData(db, "access-token");

    expect(deleteLabels).toHaveBeenCalledWith(db, ["label-1"]);
    expect(deleteProjects).toHaveBeenCalledWith(db, ["p1"]);
    expect(deleteTasks).toHaveBeenCalledWith(db, ["task-1"]);
    expect(upsertLabels).toHaveBeenCalledWith(db, []);
    expect(upsertProjects).toHaveBeenCalledWith(db, []);
    expect(upsertTasks).toHaveBeenCalledWith(db, []);
  });

  it("only upserts, calling deletes with an empty list, when a delta contains solely additions", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "delta",
      syncToken: "token",
      labels: [syncLabelFixture],
      projects: [syncProjectFixture],
      items: [syncItemFixture],
    });

    await syncTodoistData(db, "access-token");

    expect(deleteLabels).toHaveBeenCalledWith(db, []);
    expect(deleteProjects).toHaveBeenCalledWith(db, []);
    expect(deleteTasks).toHaveBeenCalledWith(db, []);
    expect(upsertLabels).toHaveBeenCalledWith(db, [
      expect.objectContaining({ id: "label-1" }),
    ]);
  });

  it("does nothing when a delta reports no changes at all", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "delta",
      syncToken: "token",
      labels: [],
      projects: [],
      items: [],
    });

    await syncTodoistData(db, "access-token");

    expect(upsertLabels).toHaveBeenCalledWith(db, []);
    expect(deleteLabels).toHaveBeenCalledWith(db, []);
    expect(upsertProjects).toHaveBeenCalledWith(db, []);
    expect(deleteProjects).toHaveBeenCalledWith(db, []);
    expect(upsertTasks).toHaveBeenCalledWith(db, []);
    expect(deleteTasks).toHaveBeenCalledWith(db, []);
  });
});

describe("syncTodoistData / task-to-project resolution", () => {
  it("throws a readable error when a task references a project that wasn't synced", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "token",
      labels: [],
      projects: [],
      items: [{ ...syncItemFixture, projectId: "missing-project" }],
    });
    (getProjects as jest.Mock).mockResolvedValueOnce([]);

    await expect(syncTodoistData(db, "access-token")).rejects.toThrow(
      "Failed to save the synced Todoist data locally.",
    );
  });
});

describe("syncTodoistData / error handling", () => {
  it("wraps a SQLite failure raised while upserting labels", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "token",
      labels: [],
      projects: [],
      items: [],
    });
    const sqlError = new Error("SQLITE_BUSY");
    (upsertLabels as jest.Mock).mockRejectedValueOnce(sqlError);

    const promise = syncTodoistData(db, "access-token");

    await expect(promise).rejects.toThrow(
      "Failed to save the synced Todoist data locally.",
    );
    await expect(promise).rejects.toHaveProperty("cause", sqlError);
  });

  it("wraps a SQLite failure raised while upserting tasks", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "token",
      labels: [],
      projects: [],
      items: [syncItemFixture],
    });
    const sqlError = new Error("SQLITE_CONSTRAINT");
    (upsertTasks as jest.Mock).mockRejectedValueOnce(sqlError);

    const promise = syncTodoistData(db, "access-token");

    await expect(promise).rejects.toThrow(
      "Failed to save the synced Todoist data locally.",
    );
    await expect(promise).rejects.toHaveProperty("cause", sqlError);
  });

  it("does not attempt to read the local state back after a write failure", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "token",
      labels: [],
      projects: [],
      items: [],
    });
    (upsertLabels as jest.Mock).mockRejectedValueOnce(new Error("SQLITE_BUSY"));

    await expect(syncTodoistData(db, "access-token")).rejects.toThrow();

    expect(getTasks).not.toHaveBeenCalled();
    expect(getProjects).not.toHaveBeenCalled();
    expect(getLabels).not.toHaveBeenCalled();
  });
});

describe("syncTodoistData / sync token persistence", () => {
  it("persists the new sync token once every local write succeeds", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "new-token",
      labels: [],
      projects: [],
      items: [],
    });

    await syncTodoistData(db, "access-token");

    expect(setSyncToken).toHaveBeenCalledWith("new-token");
  });

  it("does not persist the sync token when a local write fails", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "new-token",
      labels: [],
      projects: [],
      items: [],
    });
    (upsertLabels as jest.Mock).mockRejectedValueOnce(new Error("SQLITE_BUSY"));

    await expect(syncTodoistData(db, "access-token")).rejects.toThrow();

    expect(setSyncToken).not.toHaveBeenCalled();
  });
});

describe("syncTodoistData / return value", () => {
  it("resolves with the local state freshly read from SQLite after reconciling", async () => {
    mockedSyncTodoist.mockResolvedValue({
      type: "full",
      syncToken: "token",
      labels: [],
      projects: [],
      items: [],
    });

    const persistedProjects = [
      Project.create({ id: "p1", name: "Inbox", color: "red" }),
    ];
    // getProjects is read twice (once to resolve tasks' projects, once for the final
    // return value) — resolve both calls to the same reference for a stable assertion.
    (getProjects as jest.Mock).mockResolvedValue(persistedProjects);

    const result = await syncTodoistData(db, "access-token");

    expect(result.projects).toBe(persistedProjects);
    expect(result.tasks).toEqual([]);
    expect(result.labels).toEqual([]);
  });
});
