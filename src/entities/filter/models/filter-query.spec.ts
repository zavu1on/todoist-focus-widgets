import { Project } from "@/entities/project";
import { Priority, Task } from "@/entities/task";
import { dayjs } from "@/shared/lib";
import { DueQueryConstraint } from "./due";
import { FilterQuery, type ReconstituteFilterQueryInput } from "./filter-query";
import { QueryConcatenator } from "./query-concatenator";

const validInput: ReconstituteFilterQueryInput = {
  concatenator: QueryConcatenator.AND,
  project: { id: "1", name: "Inbox" },
  priorities: [Priority.HIGH],
  labels: ["urgent"],
  due: DueQueryConstraint.TODAY,
};

describe("FilterQuery.safeParse", () => {
  it("parses a valid JSON representation", () => {
    const query = FilterQuery.safeParse(JSON.stringify(validInput));

    expect(query.concatenator).toBe(validInput.concatenator);
    expect(query.project).toEqual(validInput.project);
    expect(query.priorities).toEqual(validInput.priorities);
    expect(query.labels).toEqual(validInput.labels);
    expect(query.due).toBe(validInput.due);
  });

  it("throws when the string is not valid JSON", () => {
    expect(() => FilterQuery.safeParse("{not json")).toThrow();
  });

  it("throws when the JSON content doesn't match the schema", () => {
    expect(() => FilterQuery.safeParse(JSON.stringify({}))).toThrow();
  });
});

describe("FilterQuery.of", () => {
  it("wraps already-trusted data without validating it", () => {
    const query = FilterQuery.of(validInput);

    expect(query.concatenator).toBe(validInput.concatenator);
  });
});

describe("FilterQuery.prototype.satisfiesFilter", () => {
  const inboxProject = Project.create({ id: "1", name: "Inbox", color: "red" });
  const workProject = Project.create({ id: "2", name: "Work", color: "blue" });

  const buildTask = (
    overrides: Partial<Parameters<typeof Task.create>[0]> = {},
  ) =>
    Task.create({
      id: "task-1",
      content: "Buy milk",
      project: inboxProject,
      priority: Priority.HIGH,
      due: {
        isRecurring: false,
        string: "today",
        date: dayjs().format("YYYY-MM-DD"),
      },
      checked: false,
      url: "https://todoist.com/showTask?id=1",
      labels: ["urgent"],
      ...overrides,
    });

  it("matches project by id", () => {
    const query = FilterQuery.of({
      ...validInput,
      project: { id: "1", name: "Inbox" },
    });

    expect(query.satisfiesFilter(buildTask({ project: inboxProject }))).toBe(
      true,
    );
    expect(query.satisfiesFilter(buildTask({ project: workProject }))).toBe(
      false,
    );
  });

  it("ignores priority when the list is empty, otherwise requires membership", () => {
    const emptyPriorities = FilterQuery.of({ ...validInput, priorities: [] });
    const withPriorities = FilterQuery.of({
      ...validInput,
      priorities: [Priority.URGENT],
    });

    expect(
      emptyPriorities.satisfiesFilter(buildTask({ priority: Priority.NORMAL })),
    ).toBe(true);
    expect(
      withPriorities.satisfiesFilter(buildTask({ priority: Priority.HIGH })),
    ).toBe(false);
    expect(
      withPriorities.satisfiesFilter(buildTask({ priority: Priority.URGENT })),
    ).toBe(true);
  });

  it("ignores labels when the list is empty, otherwise matches any of them (OR)", () => {
    const emptyLabels = FilterQuery.of({ ...validInput, labels: [] });
    const withLabels = FilterQuery.of({
      ...validInput,
      labels: ["urgent", "home"],
    });

    expect(emptyLabels.satisfiesFilter(buildTask({ labels: [] }))).toBe(true);
    expect(withLabels.satisfiesFilter(buildTask({ labels: ["home"] }))).toBe(
      true,
    );
    expect(withLabels.satisfiesFilter(buildTask({ labels: ["work"] }))).toBe(
      false,
    );
  });

  it("matches due per the configured constraint", () => {
    const dueToday = FilterQuery.of({
      ...validInput,
      due: DueQueryConstraint.TODAY,
    });
    const noDate = FilterQuery.of({
      ...validInput,
      due: DueQueryConstraint.NO_DATE,
    });

    expect(
      dueToday.satisfiesFilter(
        buildTask({
          due: {
            isRecurring: false,
            string: "today",
            date: dayjs().format("YYYY-MM-DD"),
          },
        }),
      ),
    ).toBe(true);
    expect(noDate.satisfiesFilter(buildTask({ due: null }))).toBe(true);
    expect(noDate.satisfiesFilter(buildTask())).toBe(false);
  });

  it("combines conditions with AND or OR per the concatenator", () => {
    const andQuery = FilterQuery.of({
      ...validInput,
      concatenator: QueryConcatenator.AND,
      project: { id: "1", name: "Inbox" },
      priorities: [Priority.URGENT],
    });
    const orQuery = FilterQuery.of({
      ...validInput,
      concatenator: QueryConcatenator.OR,
      project: { id: "1", name: "Inbox" },
      priorities: [Priority.URGENT],
    });

    const wrongProjectRightPriority = buildTask({
      project: workProject,
      priority: Priority.URGENT,
    });

    expect(andQuery.satisfiesFilter(wrongProjectRightPriority)).toBe(false);
    expect(orQuery.satisfiesFilter(wrongProjectRightPriority)).toBe(true);
  });
});
