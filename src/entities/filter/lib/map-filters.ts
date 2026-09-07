import { deserializeDate, serializeDate } from "@/shared/lib";
import type { FilterRow } from "../api/createFiltersTable";
import { Filter } from "../models/filter";

export const mapFilterRowToFilter = (row: FilterRow): Filter =>
  Filter.reconstitute({
    id: row.id,
    title: row.title,
    queryJsonString: row.query,
    lastUpdate: deserializeDate(row.last_update),
  });

export const mapFilterToFilterRow = (filter: Filter): FilterRow => ({
  id: filter.id,
  title: filter.title,
  query: JSON.stringify(filter.query),
  last_update: serializeDate(filter.lastUpdate),
});
