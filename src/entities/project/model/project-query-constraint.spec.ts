import { projectQueryConstraintSchema } from "./project-query-constraint";

describe("projectQueryConstraintSchema", () => {
  it("accepts a project with a non-empty id and name", () => {
    const input = { id: "123", name: "Inbox" };

    expect(projectQueryConstraintSchema.parse(input)).toEqual(input);
  });

  it.each([
    ["empty id", { id: "", name: "Inbox" }],
    ["empty name", { id: "123", name: "" }],
    ["non-string id", { id: 123, name: "Inbox" }],
  ])("rejects a project with %s", (_description, input) => {
    expect(() => projectQueryConstraintSchema.parse(input)).toThrow();
  });
});
