import { router, useLocalSearchParams } from "expo-router";
import type { FC } from "react";
import { useFiltersQuery } from "@/entities/filter";
import { UpsertFilterForm } from "@/features/upsert-filter-form";

export const FilterFormPage: FC = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const filtersQuery = useFiltersQuery();

  if (id !== undefined && filtersQuery.data === undefined) {
    return null;
  }

  const initialFilter = filtersQuery.data?.find(
    (filter) => filter.id === Number(id),
  );

  return (
    <UpsertFilterForm
      initialFilter={initialFilter}
      onSaved={() => router.back()}
      onCancel={() => router.back()}
    />
  );
};
