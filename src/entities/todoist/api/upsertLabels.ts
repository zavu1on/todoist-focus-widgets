import type { SQLiteDatabase } from "expo-sqlite";
import { mapLabelToLabelRow } from "../lib/map-labels";
import type { Label } from "../model/label";

export const upsertLabels = async (
  db: SQLiteDatabase,
  labels: Label[],
): Promise<void> => {
  await db.withTransactionAsync(async () => {
    for (const label of labels) {
      const row = mapLabelToLabelRow(label);

      await db.runAsync(
        `--sql
        INSERT INTO labels (id, name, color)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          color = excluded.color
        `,
        row.id,
        row.name,
        row.color,
      );
    }
  });
};
