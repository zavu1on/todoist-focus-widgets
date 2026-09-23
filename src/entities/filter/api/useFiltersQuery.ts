import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { useDatabase } from "@/shared/model";
import type { Filter } from "../models/filter";
import { filtersListQueryKey } from "../models/queryKeys";
import { getFilters } from "./getFilters";

export const useFiltersQuery = (): UseQueryResult<Filter[]> => {
  const db = useDatabase();

  return useQuery({
    queryKey: filtersListQueryKey,
    queryFn: () => getFilters(db),
  });
};
