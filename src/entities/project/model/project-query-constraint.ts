import z from "zod";

export const projectQueryConstraintSchema = z.object({
  id: z
    .string("Project id must be a text value.")
    .min(1, "Project id can't be empty."),
  name: z
    .string("Project name must be a text value.")
    .min(1, "Project name can't be empty."),
});

export type ProjectQueryConstraint = z.infer<
  typeof projectQueryConstraintSchema
>;
