import { FilterTitle } from "./filter-title";

describe("FilterTitle.create", () => {
  it("accepts a non-empty title up to 60 characters", () => {
    expect(FilterTitle.create("Work").value).toBe("Work");
    expect(FilterTitle.create("a".repeat(60)).value).toHaveLength(60);
  });

  it("rejects an empty title", () => {
    expect(() => FilterTitle.create("")).toThrow();
  });

  it("rejects a title longer than 60 characters", () => {
    expect(() => FilterTitle.create("a".repeat(61))).toThrow();
  });
});

describe("FilterTitle.of", () => {
  it("wraps already-trusted data without validating it", () => {
    expect(FilterTitle.of("").value).toBe("");
  });
});
