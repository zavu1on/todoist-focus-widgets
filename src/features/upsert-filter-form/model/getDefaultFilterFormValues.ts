import type { CreateFilterInput, Filter } from "@/entities/filter";
import { QueryConcatenator } from "@/entities/filter";

export const getDefaultFilterFormValues = (
  filter?: Filter,
): CreateFilterInput => {
  if (filter === undefined) {
    return {
      title: "",
      queryInput: {
        concatenator: QueryConcatenator.AND,
        project: undefined,
        priorities: [],
        labels: [],
        due: undefined,
      },
    };
  }

  return {
    title: filter.title,
    queryInput: {
      concatenator: filter.query.concatenator,
      project: filter.query.project,
      priorities: filter.query.priorities,
      labels: filter.query.labels,
      due: filter.query.due,
    },
  };
};
