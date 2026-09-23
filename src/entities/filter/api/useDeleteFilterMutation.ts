import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDatabase } from "@/shared/model";
import { filtersListQueryKey } from "../models/queryKeys";
import { deleteFilter } from "./deleteFilter";

export const useDeleteFilterMutation = () => {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFilter(db, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filtersListQueryKey });
    },
  });
};
