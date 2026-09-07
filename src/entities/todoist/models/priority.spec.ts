import { Priority, prioritySchema, priorityVariants } from "./priority";

describe("prioritySchema", () => {
  it("accepts every declared priority value", () => {
    expect(prioritySchema.parse(Priority.NORMAL)).toBe(Priority.NORMAL);
    expect(prioritySchema.parse(Priority.MEDIUM)).toBe(Priority.MEDIUM);
    expect(prioritySchema.parse(Priority.HIGH)).toBe(Priority.HIGH);
    expect(prioritySchema.parse(Priority.URGENT)).toBe(Priority.URGENT);
  });

  it("rejects a value outside the allowed range", () => {
    expect(() => prioritySchema.parse(5)).toThrow();
  });
});

describe("priorityVariants", () => {
  it("labels each variant with the Todoist-facing p1..p4 name, highest priority first", () => {
    expect(priorityVariants).toEqual([
      { label: "p1", value: Priority.URGENT },
      { label: "p2", value: Priority.HIGH },
      { label: "p3", value: Priority.MEDIUM },
      { label: "p4", value: Priority.NORMAL },
    ]);
  });
});
