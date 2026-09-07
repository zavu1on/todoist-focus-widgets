import z from "zod";
import type { QueryFieldVariant } from "@/shared/lib";

export const Priority = {
  NORMAL: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
} as const;

export const prioritySchema = z.enum(
  Priority,
  "Priority must be one of the allowed values: 1 (p4), 2 (p3), 3 (p2) or 4 (p1).",
);

export type Priority = z.infer<typeof prioritySchema>;

export const priorityVariants: QueryFieldVariant<Priority>[] = [
  {
    label: "p1",
    value: Priority.URGENT,
  },
  {
    label: "p2",
    value: Priority.HIGH,
  },
  {
    label: "p3",
    value: Priority.MEDIUM,
  },
  {
    label: "p4",
    value: Priority.NORMAL,
  },
];
