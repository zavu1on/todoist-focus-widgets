import type { SQLiteDatabase } from "expo-sqlite";
import { mapFilterRowToFilter, mapFilterToFilterRow } from "../lib/map-filters";
import type { Filter } from "../models/filter";

export const createFilter = async (
  db: SQLiteDatabase,
  filter: Filter,
): Promise<Filter> => {
  const row = mapFilterToFilterRow(filter);

  const result = await db.runAsync(
    "INSERT INTO filters (title, query, last_update) VALUES (?, ?, ?)",
    row.title,
    row.query,
    row.last_update,
  );

  return mapFilterRowToFilter({ ...row, id: result.lastInsertRowId });
};
