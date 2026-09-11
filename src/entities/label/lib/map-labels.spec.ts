import type { SyncLabel } from "@doist/todoist-sdk";
import { mapSyncLabelToLabel } from "./map-labels";

const syncLabelFixture: SyncLabel = {
  id: "1",
  name: "urgent",
  color: "red",
  isFavorite: false,
  isDeleted: false,
};

describe("mapSyncLabelToLabel", () => {
  it("builds a label from a valid Todoist sync label", () => {
    const label = mapSyncLabelToLabel(syncLabelFixture);

    expect(label.id).toBe("1");
    expect(label.name).toBe("urgent");
    expect(label.color).toBe("red");
  });

  it("rejects a sync label with an empty name", () => {
    expect(() =>
      mapSyncLabelToLabel({ ...syncLabelFixture, name: "" }),
    ).toThrow();
  });
});
