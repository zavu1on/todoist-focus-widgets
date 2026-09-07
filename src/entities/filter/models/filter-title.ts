import z from "zod";

export const filterTitleSchema = z
  .string("Filter title must be a text value.")
  .min(1, "Filter title can't be empty.")
  .max(60, "Filter title can't be longer than 60 characters.");

export class FilterTitle {
  private constructor(readonly value: string) {}

  /**
   * @throws {z.ZodError<string>} when title doesn't match filterTitleSchema
   */
  static create(title: string): FilterTitle {
    return new FilterTitle(filterTitleSchema.parse(title));
  }

  /** Trusted constructor for already-valid data */
  static of(title: string): FilterTitle {
    return new FilterTitle(title);
  }
}
