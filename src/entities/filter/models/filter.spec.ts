import { Priority } from "@/entities/task";
import { DueQueryConstraint } from "./due";
import {
  type CreateFilterInput,
  Filter,
  type ReconstituteFilterInput,
} from "./filter";
import { QueryConcatenator } from "./query-concatenator";

const validQueryInput = {
  concatenator: QueryConcatenator.AND,
  project: { id: "1", name: "Inbox" },
  priorities: [Priority.HIGH],
  labels: ["urgent"],
  due: DueQueryConstraint.TODAY,
};

const validQueryJsonString = JSON.stringify(validQueryInput);

const createInput: CreateFilterInput = {
  title: "Work",
  queryInput: validQueryInput,
};

describe("Filter.create", () => {
  it("builds a filter from valid input, stamped with the current time", () => {
    const before = new Date();
    const filter = Filter.create(createInput);
    const after = new Date();

    expect(filter.title).toBe("Work");
    expect(filter.query.concatenator).toBe(QueryConcatenator.AND);
    expect(filter.lastUpdate.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(filter.lastUpdate.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("rejects an empty title", () => {
    expect(() => Filter.create({ ...createInput, title: "" })).toThrow();
  });
});

describe("Filter.reconstitute", () => {
  it("rebuilds a filter with the given id and last update, without re-deriving them", () => {
    const lastUpdate = new Date("2024-01-01T00:00:00.000Z");
    const input: ReconstituteFilterInput = {
      id: 42,
      title: "Work",
      queryJsonString: validQueryJsonString,
      lastUpdate,
    };

    const filter = Filter.reconstitute(input);

    expect(filter.id).toBe(42);
    expect(filter.title).toBe("Work");
    expect(filter.query.concatenator).toBe(validQueryInput.concatenator);
    expect(filter.lastUpdate).toBe(lastUpdate);
  });

  it("throws when queryJsonString is not valid JSON, or doesn't match the query schema", () => {
    expect(() =>
      Filter.reconstitute({
        id: 42,
        title: "Work",
        queryJsonString: "{not json",
        lastUpdate: new Date(),
      }),
    ).toThrow();

    expect(() =>
      Filter.reconstitute({
        id: 42,
        title: "Work",
        queryJsonString: JSON.stringify({}),
        lastUpdate: new Date(),
      }),
    ).toThrow();
  });
});

describe("Filter.prototype.updateTitle", () => {
  it("replaces the title and bumps lastUpdate", () => {
    const filter = Filter.reconstitute({
      id: 1,
      title: "Work",
      queryJsonString: validQueryJsonString,
      lastUpdate: new Date("2024-01-01T00:00:00.000Z"),
    });

    filter.updateTitle("Personal");

    expect(filter.title).toBe("Personal");
    expect(filter.lastUpdate.getTime()).toBeGreaterThan(
      new Date("2024-01-01T00:00:00.000Z").getTime(),
    );
  });

  it("rejects an empty title, leaving the filter unchanged", () => {
    const filter = Filter.create(createInput);

    expect(() => filter.updateTitle("")).toThrow();
    expect(filter.title).toBe("Work");
  });
});

describe("Filter.prototype.updateQuery", () => {
  it("replaces the query and bumps lastUpdate", () => {
    const filter = Filter.reconstitute({
      id: 1,
      title: "Work",
      queryJsonString: validQueryJsonString,
      lastUpdate: new Date("2024-01-01T00:00:00.000Z"),
    });

    filter.updateQuery({
      ...validQueryInput,
      concatenator: QueryConcatenator.OR,
    });

    expect(filter.query.concatenator).toBe(QueryConcatenator.OR);
    expect(filter.lastUpdate.getTime()).toBeGreaterThan(
      new Date("2024-01-01T00:00:00.000Z").getTime(),
    );
  });

  it("rejects an invalid query, leaving the filter unchanged", () => {
    const filter = Filter.create(createInput);

    expect(() =>
      filter.updateQuery({ ...validQueryInput, priorities: [99] as never }),
    ).toThrow();
    expect(filter.query.priorities).toEqual([Priority.HIGH]);
  });
});
