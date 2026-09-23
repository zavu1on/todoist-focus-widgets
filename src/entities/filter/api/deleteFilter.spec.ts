import type { SQLiteDatabase } from "expo-sqlite";
import { deleteFilter } from "./deleteFilter";

describe("deleteFilter", () => {
  it("also cleans up widget_filter rows pointing at the deleted filter", async () => {
    const runAsync = jest.fn().mockResolvedValue(undefined);
    const db = { runAsync } as unknown as SQLiteDatabase;

    await deleteFilter(db, 7);

    expect(runAsync).toHaveBeenCalledWith(
      "DELETE FROM filters WHERE id = ?",
      7,
    );
    expect(runAsync).toHaveBeenCalledWith(
      "DELETE FROM widget_filter WHERE filter_id = ?",
      7,
    );
  });
});
