import type { SQLiteDatabase } from "expo-sqlite";
import { getWidgetFilterIds } from "./getWidgetFilterIds";

describe("getWidgetFilterIds", () => {
  it("returns a map keyed by widget id", async () => {
    const getAllAsync = jest.fn().mockResolvedValue([
      { widget_id: 1, filter_id: 11 },
      { widget_id: 2, filter_id: 22 },
    ]);
    const db = { getAllAsync } as unknown as SQLiteDatabase;

    const result = await getWidgetFilterIds(db);

    expect(result).toEqual(
      new Map([
        [1, 11],
        [2, 22],
      ]),
    );
  });
});
