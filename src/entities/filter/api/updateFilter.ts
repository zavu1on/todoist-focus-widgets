import type { SQLiteDatabase } from "expo-sqlite";
import { mapFilterToFilterRow } from "../lib/map-filters";
import type { Filter } from "../models/filter";

export const updateFilter = async (
  db: SQLiteDatabase,
  filter: Filter,
): Promise<void> => {
  const row = mapFilterToFilterRow(filter);

  await db.runAsync(
    "UPDATE filters SET title = ?, query = ?, last_update = ? WHERE id = ?",
    row.title,
    row.query,
    row.last_update,
    row.id,
  );
};
