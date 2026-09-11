import type { TodoistSyncProject } from "../model/todoist-sync-project";
import { mapSyncProjectToProject } from "./map-projects";

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

describe("mapSyncProjectToProject", () => {
  it("builds a project from a valid Todoist sync project", () => {
    const project = mapSyncProjectToProject(syncProjectFixture);

    expect(project.id).toBe("1");
    expect(project.name).toBe("Inbox");
    expect(project.color).toBe("charcoal");
  });

  it("rejects a sync project with an empty name", () => {
    expect(() =>
      mapSyncProjectToProject({ ...syncProjectFixture, name: "" }),
    ).toThrow();
  });
});
