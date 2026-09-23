import { useMutation } from "@tanstack/react-query";
import { useDatabase } from "@/shared/model";
import { pinFilterWidget } from "./pinFilterWidget";

export const usePinFilterWidgetMutation = () => {
  const db = useDatabase();

  return useMutation({
    mutationFn: (filterId: number) => pinFilterWidget(db, filterId),
  });
};
