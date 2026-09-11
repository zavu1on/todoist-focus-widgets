import { Project } from "@/entities/project";
import { Priority } from "../model/priority";
import type { TodoistSyncItem } from "../model/todoist-sync-item";
import { mapSyncItemToTask } from "./map-tasks";

const syncItemFixture: TodoistSyncItem = {
  isUncompletable: false,
  url: "https://todoist.com/showTask?id=1",
  id: "1",
  userId: "u1",
  projectId: "p1",
  sectionId: null,
  parentId: null,
  addedByUid: null,
  assignedByUid: null,
  responsibleUid: null,
  labels: ["urgent"],
  deadline: null,
  duration: null,
  checked: false,
  isDeleted: false,
  addedAt: null,
  completedAt: null,
  updatedAt: null,
  due: null,
  priority: Priority.HIGH,
  childOrder: 1,
  content: "Buy milk",
  description: "",
  dayOrder: 1,
  isCollapsed: false,
};

const projectFixture = Project.create({
  id: syncItemFixture.projectId,
  name: "Groceries",
  color: "charcoal",
});

describe("mapSyncItemToTask", () => {
  it("builds a task from a valid Todoist sync item and its resolved project", () => {
    const task = mapSyncItemToTask(syncItemFixture, projectFixture);

    expect(task.id).toBe("1");
    expect(task.content).toBe("Buy milk");
    expect(task.project).toBe(projectFixture);
    expect(task.priority).toBe(Priority.HIGH);
    expect(task.due).toBeNull();
    expect(task.checked).toBe(false);
    expect(task.url).toBe(syncItemFixture.url);
    expect(task.labels).toEqual(["urgent"]);
  });

  it("rejects a sync item with an invalid priority", () => {
    expect(() =>
      mapSyncItemToTask(
        { ...syncItemFixture, priority: 99 as never },
        projectFixture,
      ),
    ).toThrow();
  });
});
