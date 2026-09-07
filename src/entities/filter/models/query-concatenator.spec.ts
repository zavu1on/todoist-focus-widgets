import {
  QueryConcatenator,
  queryConcatenatorSchema,
} from "./query-concatenator";

describe("queryConcatenatorSchema", () => {
  it("accepts 'and' and 'or'", () => {
    expect(queryConcatenatorSchema.parse(QueryConcatenator.AND)).toBe("and");
    expect(queryConcatenatorSchema.parse(QueryConcatenator.OR)).toBe("or");
  });

  it("rejects any other value", () => {
    expect(() => queryConcatenatorSchema.parse("xor")).toThrow();
  });
});
