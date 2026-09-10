import { Priority } from "./priority";
import { Project } from "./project";
import { type CreateTaskInput, type ReconstituteTaskInput, Task } from "./task";
import type { TodoistSyncItem } from "./todoist-sync-result";

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

// The SDK types priority as a plain number; the domain restricts it to a known Priority value.
const createInput: CreateTaskInput = {
  id: syncItemFixture.id,
  content: syncItemFixture.content,
  project: projectFixture,
  priority: syncItemFixture.priority as Priority,
  due: syncItemFixture.due,
  checked: syncItemFixture.checked,
  url: syncItemFixture.url,
  labels: syncItemFixture.labels,
};

describe("Task.create", () => {
  it("builds a task from a valid Todoist sync item", () => {
    const task = Task.create(createInput);

    expect(task.id).toBe("1");
    expect(task.content).toBe("Buy milk");
    expect(task.project).toBe(projectFixture);
    expect(task.priority).toBe(Priority.HIGH);
    expect(task.due).toBeNull();
    expect(task.checked).toBe(false);
    expect(task.url).toBe(syncItemFixture.url);
    expect(task.labels).toEqual(["urgent"]);
  });

  it("rejects an invalid priority", () => {
    expect(() =>
      Task.create({ ...createInput, priority: 99 as never }),
    ).toThrow();
  });
});

describe("Task.reconstitute", () => {
  const reconstituteInput: ReconstituteTaskInput = {
    id: "1",
    content: "Buy milk",
    project: projectFixture,
    priority: Priority.HIGH,
    dueJsonString: JSON.stringify({
      isRecurring: false,
      string: "today",
      date: "2024-01-01",
    }),
    checked: false,
    url: syncItemFixture.url,
    labelsJsonString: JSON.stringify(["urgent"]),
  };

  it("rebuilds a task from a database row, decoding the serialized due date and labels", () => {
    const task = Task.reconstitute(reconstituteInput);

    expect(task.id).toBe("1");
    expect(task.due).toEqual({
      isRecurring: false,
      string: "today",
      date: "2024-01-01",
    });
    expect(task.labels).toEqual(["urgent"]);
  });

  it("rebuilds a task with a null due date", () => {
    const task = Task.reconstitute({
      ...reconstituteInput,
      dueJsonString: null,
    });

    expect(task.due).toBeNull();
  });

  it("throws when dueJsonString is not valid JSON, or doesn't match the due schema", () => {
    expect(() =>
      Task.reconstitute({ ...reconstituteInput, dueJsonString: "{not json" }),
    ).toThrow();

    expect(() =>
      Task.reconstitute({
        ...reconstituteInput,
        dueJsonString: JSON.stringify({ isRecurring: "yes" }),
      }),
    ).toThrow();
  });

  it("throws when labelsJsonString is not valid JSON, or doesn't match an array of strings", () => {
    expect(() =>
      Task.reconstitute({
        ...reconstituteInput,
        labelsJsonString: "{not json",
      }),
    ).toThrow();

    expect(() =>
      Task.reconstitute({
        ...reconstituteInput,
        labelsJsonString: JSON.stringify([1, 2]),
      }),
    ).toThrow();
  });
});

describe("Task.prototype.updateFromSync", () => {
  it("overwrites every field with the new sync delta", () => {
    const task = Task.create(createInput);
    const otherProject = Project.create({
      id: "p2",
      name: "Work",
      color: "red",
    });

    task.updateFromSync({
      content: "Buy oat milk",
      project: otherProject,
      priority: Priority.NORMAL,
      due: { isRecurring: false, string: "tomorrow", date: "2024-01-02" },
      checked: true,
      url: syncItemFixture.url,
      labels: ["urgent", "shopping"],
    });

    expect(task.content).toBe("Buy oat milk");
    expect(task.project).toBe(otherProject);
    expect(task.priority).toBe(Priority.NORMAL);
    expect(task.due).toEqual({
      isRecurring: false,
      string: "tomorrow",
      date: "2024-01-02",
    });
    expect(task.checked).toBe(true);
    expect(task.labels).toEqual(["urgent", "shopping"]);
  });

  it("rejects an invalid payload, leaving the task unchanged", () => {
    const task = Task.create(createInput);

    expect(() =>
      task.updateFromSync({ ...createInput, priority: 99 as never }),
    ).toThrow();
    expect(task.priority).toBe(Priority.HIGH);
  });
});
