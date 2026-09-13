import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { filtersListQueryKey } from "../models/queryKeys";
import { deleteFilter } from "./deleteFilter";

export const useDeleteFilterMutation = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFilter(db, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filtersListQueryKey });
    },
  });
};
