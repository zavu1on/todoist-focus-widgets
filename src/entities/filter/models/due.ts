import z from "zod";
import type { QueryFieldVariant } from "@/shared/lib";

export const DueQueryConstraint = {
  TODAY_WITH_OVERDUE: "today_with_overdue",
  TODAY: "today",
  NEXT_7_DAYS: "next_7_days",
  NO_DATE: "no_date",
} as const;

export const dueQueryConstraintSchema = z.enum(
  DueQueryConstraint,
  "Due filter must be one of the supported options.",
);

export type DueQueryConstraint = z.infer<typeof dueQueryConstraintSchema>;

export const dueVariants: QueryFieldVariant<DueQueryConstraint>[] = [
  {
    label: "Today + Overdue",
    value: DueQueryConstraint.TODAY_WITH_OVERDUE,
  },
  {
    label: "Today",
    value: DueQueryConstraint.TODAY,
  },
  {
    label: "Next 7 days",
    value: DueQueryConstraint.NEXT_7_DAYS,
  },
  {
    label: "No date",
    value: DueQueryConstraint.NO_DATE,
  },
];
