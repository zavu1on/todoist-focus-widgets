import { getProjectColorHex } from "./todoist-color-palette";

describe("getProjectColorHex", () => {
  it("resolves a known Todoist color name to its hex value", () => {
    expect(getProjectColorHex("berry_red")).toBe("#b8255f");
    expect(getProjectColorHex("blue")).toBe("#4073ff");
  });

  it("falls back to charcoal for an unknown color name", () => {
    expect(getProjectColorHex("not-a-real-color")).toBe("#808080");
  });
});
