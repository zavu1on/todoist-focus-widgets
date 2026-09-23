import type { SQLiteDatabase } from "expo-sqlite";
import { addPendingWidgetFilterId } from "./addPendingWidgetFilterId";
import { popPendingWidgetFilterId } from "./popPendingWidgetFilterId";

describe("pending_widget_filter FIFO queue", () => {
  it("appends to the queue instead of overwriting a single slot", async () => {
    const runAsync = jest.fn().mockResolvedValue(undefined);
    const db = { runAsync } as unknown as SQLiteDatabase;

    await addPendingWidgetFilterId(db, 11);
    await addPendingWidgetFilterId(db, 22);

    expect(runAsync).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO pending_widget_filter (filter_id) VALUES (?)",
      11,
    );
    expect(runAsync).toHaveBeenNthCalledWith(
      2,
      "INSERT INTO pending_widget_filter (filter_id) VALUES (?)",
      22,
    );
  });

  it("returns queued filter ids in insertion order, one per call", async () => {
    const queue = [11, 22];
    const getFirstAsync = jest.fn(async () => {
      const filterId = queue.shift();
      return filterId === undefined ? null : { filter_id: filterId };
    });
    const db = { getFirstAsync } as unknown as SQLiteDatabase;

    await expect(popPendingWidgetFilterId(db)).resolves.toBe(11);
    await expect(popPendingWidgetFilterId(db)).resolves.toBe(22);
    await expect(popPendingWidgetFilterId(db)).resolves.toBeNull();
  });

  it("clears the oldest entry with a single atomic statement", async () => {
    const getFirstAsync = jest.fn().mockResolvedValue(null);
    const db = { getFirstAsync } as unknown as SQLiteDatabase;

    await popPendingWidgetFilterId(db);

    expect(getFirstAsync).toHaveBeenCalledTimes(1);
    expect(getFirstAsync.mock.calls[0][0]).toContain("DELETE FROM");
    expect(getFirstAsync.mock.calls[0][0]).toContain("RETURNING filter_id");
  });
});
