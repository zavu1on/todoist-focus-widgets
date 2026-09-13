import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import type { CreateFilterInput } from "../models/filter";
import { Filter } from "../models/filter";
import { filtersListQueryKey } from "../models/queryKeys";
import { createFilter } from "./createFilter";

export const useCreateFilterMutation = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFilterInput) =>
      createFilter(db, Filter.create(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: filtersListQueryKey,
        refetchType: "none",
      });
    },
  });
};
