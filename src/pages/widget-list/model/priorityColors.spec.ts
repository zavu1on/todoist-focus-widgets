import { Priority } from "@/entities/task";
import { getCardPriority, PRIORITY_COLORS } from "./priorityColors";

describe("getCardPriority", () => {
  it("falls back to NORMAL (grey) when no priority is configured", () => {
    expect(getCardPriority([])).toBe(Priority.NORMAL);
  });

  it("picks the most urgent configured priority", () => {
    expect(getCardPriority([Priority.MEDIUM, Priority.URGENT])).toBe(
      Priority.URGENT,
    );
  });
});

describe("PRIORITY_COLORS", () => {
  it("has one color per priority", () => {
    expect(Object.keys(PRIORITY_COLORS)).toHaveLength(
      Object.keys(Priority).length,
    );
  });
});
