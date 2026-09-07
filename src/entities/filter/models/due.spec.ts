import {
  DueQueryConstraint,
  dueQueryConstraintSchema,
  dueVariants,
} from "./due";

describe("dueQueryConstraintSchema", () => {
  it("accepts every declared due constraint", () => {
    for (const value of Object.values(DueQueryConstraint)) {
      expect(dueQueryConstraintSchema.parse(value)).toBe(value);
    }
  });

  it("rejects a value outside the allowed range", () => {
    expect(() => dueQueryConstraintSchema.parse("yesterday")).toThrow();
  });
});

describe("dueVariants", () => {
  it("has one labeled variant per DueQueryConstraint value", () => {
    const values = dueVariants.map((variant) => variant.value);

    expect(values).toEqual(Object.values(DueQueryConstraint));
  });
});
