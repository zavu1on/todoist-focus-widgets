import z from "zod";
import { projectQueryConstraintSchema } from "@/entities/project";
import { prioritySchema } from "@/entities/task";
import { dueQueryConstraintSchema } from "./due";
import { queryConcatenatorSchema } from "./query-concatenator";

export const filterQuerySchema = z.object({
  concatenator: queryConcatenatorSchema,
  project: projectQueryConstraintSchema,
  priorities: z.array(
    prioritySchema,
    "Priorities must be a list of valid priority values.",
  ),
  labels: z.array(z.string("Each label must be a text value.")),
  due: dueQueryConstraintSchema,
});

export type ReconstituteFilterQueryInput = z.infer<typeof filterQuerySchema>;

export class FilterQuery {
  private constructor(
    readonly concatenator: ReconstituteFilterQueryInput["concatenator"],
    readonly project: ReconstituteFilterQueryInput["project"],
    readonly priorities: ReconstituteFilterQueryInput["priorities"],
    readonly labels: ReconstituteFilterQueryInput["labels"],
    readonly due: ReconstituteFilterQueryInput["due"],
  ) {}

  /**
   * Parses and validates a filter query from its JSON representation.
   *
   * @throws {z.ZodError<ReconstituteFilterQueryInput>} when jsonString is not valid JSON, or its content doesn't match filterQuerySchema
   */
  static safeParse(jsonString: string): FilterQuery {
    let unsafeData: unknown;

    try {
      unsafeData = JSON.parse(jsonString);
    } catch {
      throw new z.ZodError([
        {
          code: "custom",
          message: "Filter query must be a valid JSON string.",
          path: [],
          input: jsonString,
        },
      ]) as z.ZodError<ReconstituteFilterQueryInput>;
    }

    return FilterQuery.of(filterQuerySchema.parse(unsafeData));
  }

  /**
   * Trusted constructor for already-valid data
   */
  static of(input: ReconstituteFilterQueryInput): FilterQuery {
    return new FilterQuery(
      input.concatenator,
      input.project,
      input.priorities,
      input.labels,
      input.due,
    );
  }

  satisfiesFilter(_task: unknown): boolean {
    throw new Error("method is not implemented");
  }
}
