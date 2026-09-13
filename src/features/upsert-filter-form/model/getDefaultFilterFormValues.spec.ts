import { Filter } from "@/entities/filter";
import { getDefaultFilterFormValues } from "./getDefaultFilterFormValues";

describe("getDefaultFilterFormValues", () => {
  it("returns blank values with AND concatenator when no filter is given", () => {
    const values = getDefaultFilterFormValues();

    expect(values).toEqual({
      title: "",
      queryInput: {
        concatenator: "and",
        project: undefined,
        priorities: [],
        labels: [],
        due: undefined,
      },
    });
  });

  it("copies title and query fields from an existing filter", () => {
    const filter = Filter.create({
      title: "Groceries",
      queryInput: {
        concatenator: "or",
        project: { id: "p1", name: "Inbox" },
        priorities: [4],
        labels: ["errands"],
        due: "today",
      },
    });

    const values = getDefaultFilterFormValues(filter);

    expect(values).toEqual({
      title: "Groceries",
      queryInput: {
        concatenator: "or",
        project: { id: "p1", name: "Inbox" },
        priorities: [4],
        labels: ["errands"],
        due: "today",
      },
    });
  });
});
