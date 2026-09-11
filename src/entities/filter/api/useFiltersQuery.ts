import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import type { Filter } from "../models/filter";
import { filtersListQueryKey } from "../models/queryKeys";
import { getFilters } from "./getFilters";

export const useFiltersQuery = (): UseQueryResult<Filter[]> => {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: filtersListQueryKey,
    queryFn: () => getFilters(db),
  });
};
