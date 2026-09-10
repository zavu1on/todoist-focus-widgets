import { type CreateProjectInput, Project } from "./project";
import type { TodoistSyncProject } from "./todoist-sync-result";

const syncProjectFixture: TodoistSyncProject = {
  url: "https://todoist.com/showProject?id=1",
  id: "1",
  canAssignTasks: false,
  childOrder: 1,
  color: "charcoal",
  createdAt: null,
  isArchived: false,
  isDeleted: false,
  isFavorite: false,
  isFrozen: false,
  name: "Inbox",
  updatedAt: null,
  viewStyle: "list",
  defaultOrder: 1,
  description: "",
  isCollapsed: false,
  isShared: false,
  parentId: null,
  inboxProject: true,
};

const createInput: CreateProjectInput = {
  id: syncProjectFixture.id,
  name: syncProjectFixture.name,
  color: syncProjectFixture.color,
};

describe("Project.create", () => {
  it("builds a project from a valid Todoist sync project", () => {
    const project = Project.create(createInput);

    expect(project.id).toBe("1");
    expect(project.name).toBe("Inbox");
    expect(project.color).toBe("charcoal");
  });

  it("rejects an empty name", () => {
    expect(() => Project.create({ ...createInput, name: "" })).toThrow();
  });
});

describe("Project.reconstitute", () => {
  it("rebuilds a project from a database row", () => {
    const project = Project.reconstitute(createInput);

    expect(project.id).toBe("1");
    expect(project.name).toBe("Inbox");
    expect(project.color).toBe("charcoal");
  });
});

describe("Project.prototype.updateFromSync", () => {
  it("overwrites every field with the new sync delta", () => {
    const project = Project.create(createInput);

    project.updateFromSync({ name: "Work", color: "red" });

    expect(project.name).toBe("Work");
    expect(project.color).toBe("red");
  });

  it("rejects an invalid payload, leaving the project unchanged", () => {
    const project = Project.create(createInput);

    expect(() => project.updateFromSync({ name: "", color: "red" })).toThrow();
    expect(project.name).toBe("Inbox");
  });
});
