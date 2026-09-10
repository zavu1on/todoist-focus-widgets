import type { SyncLabel } from "@doist/todoist-sdk";
import { type CreateLabelInput, Label } from "./label";

const syncLabelFixture: SyncLabel = {
  id: "1",
  name: "urgent",
  color: "red",
  isFavorite: false,
  isDeleted: false,
};

const createInput: CreateLabelInput = {
  id: syncLabelFixture.id,
  name: syncLabelFixture.name,
  color: syncLabelFixture.color,
};

describe("Label.create", () => {
  it("builds a label from a valid Todoist sync label", () => {
    const label = Label.create(createInput);

    expect(label.id).toBe("1");
    expect(label.name).toBe("urgent");
    expect(label.color).toBe("red");
  });

  it("rejects an empty name", () => {
    expect(() => Label.create({ ...createInput, name: "" })).toThrow();
  });
});

describe("Label.reconstitute", () => {
  it("rebuilds a label from a database row", () => {
    const label = Label.reconstitute(createInput);

    expect(label.id).toBe("1");
    expect(label.name).toBe("urgent");
    expect(label.color).toBe("red");
  });
});

describe("Label.prototype.updateFromSync", () => {
  it("overwrites every field with the new sync delta", () => {
    const label = Label.create(createInput);

    label.updateFromSync({ name: "important", color: "blue" });

    expect(label.name).toBe("important");
    expect(label.color).toBe("blue");
  });

  it("rejects an invalid payload, leaving the label unchanged", () => {
    const label = Label.create(createInput);

    expect(() => label.updateFromSync({ name: "", color: "blue" })).toThrow();
    expect(label.name).toBe("urgent");
  });
});
