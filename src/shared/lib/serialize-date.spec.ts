import { deserializeDate, serializeDate } from "./serialize-date";

describe("serializeDate", () => {
  it("formats a date as a UTC ISO string", () => {
    const date = new Date("2024-03-15T10:30:00.000Z");

    expect(serializeDate(date)).toBe("2024-03-15T10:30:00.000Z");
  });
});

describe("deserializeDate", () => {
  it("parses a serialized date back to the same instant", () => {
    const date = new Date("2024-03-15T10:30:00.000Z");

    expect(deserializeDate(serializeDate(date))).toEqual(date);
  });

  it("throws on a string that isn't a valid date", () => {
    expect(() => deserializeDate("not a date")).toThrow();
  });
});
