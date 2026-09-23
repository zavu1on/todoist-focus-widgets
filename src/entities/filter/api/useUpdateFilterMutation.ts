import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDatabase } from "@/shared/model";
import type { CreateFilterInput, Filter } from "../models/filter";
import { filtersListQueryKey } from "../models/queryKeys";
import { updateFilter } from "./updateFilter";

type UpdateFilterMutationInput = {
  filter: Filter;
  input: CreateFilterInput;
};

export const useUpdateFilterMutation = () => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ filter, input }: UpdateFilterMutationInput) => {
      filter.updateTitle(input.title);
      filter.updateQuery(input.queryInput);

      return updateFilter(db, filter);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: filtersListQueryKey,
        refetchType: "none",
      });
    },
  });
};
