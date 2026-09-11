import type { Due } from "@/entities/task";
import { dayjs } from "@/shared/lib";
import {
  DueQueryConstraint,
  dueQueryConstraintSchema,
  dueVariants,
  satisfiesDue,
} from "./due";

const dueOn = (offsetDays: number): Due => ({
  isRecurring: false,
  string: "",
  date: dayjs().add(offsetDays, "day").format("YYYY-MM-DD"),
});

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

describe("satisfiesDue", () => {
  it("NO_DATE matches only a task without a due date", () => {
    expect(satisfiesDue(DueQueryConstraint.NO_DATE, null)).toBe(true);
    expect(satisfiesDue(DueQueryConstraint.NO_DATE, dueOn(0))).toBe(false);
  });

  it("TODAY_WITH_OVERDUE matches overdue and today, not future or unset", () => {
    const constraint = DueQueryConstraint.TODAY_WITH_OVERDUE;

    expect(satisfiesDue(constraint, dueOn(-3))).toBe(true);
    expect(satisfiesDue(constraint, dueOn(0))).toBe(true);
    expect(satisfiesDue(constraint, dueOn(1))).toBe(false);
    expect(satisfiesDue(constraint, null)).toBe(false);
  });

  it("TODAY matches only today", () => {
    const constraint = DueQueryConstraint.TODAY;

    expect(satisfiesDue(constraint, dueOn(0))).toBe(true);
    expect(satisfiesDue(constraint, dueOn(-1))).toBe(false);
    expect(satisfiesDue(constraint, dueOn(1))).toBe(false);
    expect(satisfiesDue(constraint, null)).toBe(false);
  });

  it("NEXT_7_DAYS matches from today through 7 days ahead inclusive", () => {
    const constraint = DueQueryConstraint.NEXT_7_DAYS;

    expect(satisfiesDue(constraint, dueOn(-1))).toBe(false);
    expect(satisfiesDue(constraint, dueOn(0))).toBe(true);
    expect(satisfiesDue(constraint, dueOn(3))).toBe(true);
    expect(satisfiesDue(constraint, dueOn(7))).toBe(true);
    expect(satisfiesDue(constraint, dueOn(10))).toBe(false);
    expect(satisfiesDue(constraint, null)).toBe(false);
  });
});
