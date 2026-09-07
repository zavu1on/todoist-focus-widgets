import z from "zod";

export const QueryConcatenator = {
  AND: "and",
  OR: "or",
} as const;

export const queryConcatenatorSchema = z.enum(
  QueryConcatenator,
  'Concatenator must be either "AND" or "OR".',
);

export type QueryConcatenator = z.infer<typeof queryConcatenatorSchema>;
