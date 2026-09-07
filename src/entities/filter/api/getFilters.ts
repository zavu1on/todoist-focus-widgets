import type { SQLiteDatabase } from "expo-sqlite";
import { mapFilterRowToFilter } from "../lib/map-filters";
import type { Filter } from "../models/filter";
import type { FilterRow } from "./createFiltersTable";

export const getFilters = async (db: SQLiteDatabase): Promise<Filter[]> => {
  const result = await db.getAllAsync<FilterRow>("SELECT * FROM filters");

  return result.map(mapFilterRowToFilter);
};
