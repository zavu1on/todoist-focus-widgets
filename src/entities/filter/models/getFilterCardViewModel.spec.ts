import { Project } from "@/entities/project";
import { Priority, Task } from "@/entities/task";
import { FilterQuery } from "./filter-query";
import { getFilterCardViewModel } from "./getFilterCardViewModel";

const inboxProject = Project.create({ id: "p1", name: "Inbox", color: "red" });

const buildQuery = () =>
  FilterQuery.of({
    concatenator: "and",
    project: { id: "p1", name: "Inbox" },
    priorities: [],
    labels: [],
    due: "no_date",
  });

const buildTask = (id: string, content: string) =>
  Task.create({
    id,
    content,
    project: inboxProject,
    priority: Priority.NORMAL,
    due: null,
    checked: false,
    url: `https://todoist.com/showTask?id=${id}`,
    labels: [],
  });

describe("getFilterCardViewModel", () => {
  it("shows no task title and no remaining count when nothing matches", () => {
    const viewModel = getFilterCardViewModel({
      filterId: 1,
      filterTitle: "Groceries",
      query: buildQuery(),
      tasks: [],
      projects: [inboxProject],
    });

    expect(viewModel.taskTitle).toBeNull();
    expect(viewModel.remainingCount).toBe(0);
  });

  it("shows the first matching task and no remaining count for a single match", () => {
    const viewModel = getFilterCardViewModel({
      filterId: 1,
      filterTitle: "Groceries",
      query: buildQuery(),
      tasks: [buildTask("1", "Buy milk")],
      projects: [inboxProject],
    });

    expect(viewModel.taskTitle).toBe("Buy milk");
    expect(viewModel.remainingCount).toBe(0);
    expect(viewModel.taskUrl).toBe("https://todoist.com/showTask?id=1");
  });

  it("has no task url when nothing matches", () => {
    const viewModel = getFilterCardViewModel({
      filterId: 1,
      filterTitle: "Groceries",
      query: buildQuery(),
      tasks: [],
      projects: [inboxProject],
    });

    expect(viewModel.taskUrl).toBeNull();
  });

  it("counts every other matching task as remaining", () => {
    const viewModel = getFilterCardViewModel({
      filterId: 1,
      filterTitle: "Groceries",
      query: buildQuery(),
      tasks: [
        buildTask("1", "Buy milk"),
        buildTask("2", "Buy bread"),
        buildTask("3", "Buy eggs"),
      ],
      projects: [inboxProject],
    });

    expect(viewModel.taskTitle).toBe("Buy milk");
    expect(viewModel.remainingCount).toBe(2);
  });

  it("resolves the project name and color from the synced projects", () => {
    const viewModel = getFilterCardViewModel({
      filterId: 1,
      filterTitle: "Groceries",
      query: buildQuery(),
      tasks: [],
      projects: [inboxProject],
    });

    expect(viewModel.projectName).toBe("Inbox");
    expect(viewModel.projectColor).toBe("#db4035");
  });

  it("leaves the project unset when it can't be resolved", () => {
    const viewModel = getFilterCardViewModel({
      filterId: 1,
      filterTitle: "Groceries",
      query: buildQuery(),
      tasks: [],
      projects: [],
    });

    expect(viewModel.projectName).toBeNull();
    expect(viewModel.projectColor).toBeNull();
  });
});
