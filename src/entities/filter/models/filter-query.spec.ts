import { Priority } from "@/entities/todoist";
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
  it("is not implemented yet", () => {
    const query = FilterQuery.of(validInput);

    expect(() => query.satisfiesFilter({})).toThrow("not implemented");
  });
});
