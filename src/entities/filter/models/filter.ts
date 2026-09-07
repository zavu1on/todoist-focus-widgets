import z from "zod";
import {
  FilterQuery,
  filterQuerySchema,
  type ReconstituteFilterQueryInput,
} from "./filter-query";
import { FilterTitle, filterTitleSchema } from "./filter-title";

export const createFilterInputSchema = z.object({
  title: filterTitleSchema,
  queryInput: filterQuerySchema,
});

export type CreateFilterInput = z.infer<typeof createFilterInputSchema>;

const reconstituteFilterInputSchema = z.object({
  id: z.number("Filter id must be a number."),
  title: filterTitleSchema,
  queryJsonString: z.string("Filter query must be a text value."),
  lastUpdate: z.date("Filter last update must be a valid date."),
});

export type ReconstituteFilterInput = z.infer<
  typeof reconstituteFilterInputSchema
>;

export class Filter {
  private _title: FilterTitle;
  private _query: FilterQuery;
  private _lastUpdate: Date;

  private constructor(
    readonly id: number,
    title: FilterTitle,
    query: FilterQuery,
    lastUpdate: Date,
  ) {
    this._title = title;
    this._query = query;
    this._lastUpdate = lastUpdate;
  }

  get title(): string {
    return this._title.value;
  }

  get query(): FilterQuery {
    return this._query;
  }

  get lastUpdate(): Date {
    return this._lastUpdate;
  }

  /**
   * Creates a new filter from user input.
   *
   * @throws {z.ZodError<CreateFilterInput>} when input doesn't match createFilterInputSchema
   */
  static create(input: CreateFilterInput): Filter {
    const validInput = createFilterInputSchema.parse(input);

    return new Filter(
      0,
      FilterTitle.of(validInput.title),
      FilterQuery.of(validInput.queryInput),
      new Date(),
    );
  }

  /**
   * Rebuilds a filter from a database row: id/title/lastUpdate are trusted as
   * already valid, while queryJsonString is decoded and validated through
   * FilterQuery.safeParse, since a stored JSON blob has to be parsed regardless
   * of how much the source is trusted.
   *
   * @throws {z.ZodError<ReconstituteFilterQueryInput>} when queryJsonString is not valid JSON, or its content doesn't match filterQuerySchema
   */
  static reconstitute(input: ReconstituteFilterInput): Filter {
    return new Filter(
      input.id,
      FilterTitle.of(input.title),
      FilterQuery.safeParse(input.queryJsonString),
      input.lastUpdate,
    );
  }

  /**
   * @throws {z.ZodError<string>} when title doesn't match filterTitleSchema
   */
  updateTitle(title: string) {
    this._title = FilterTitle.create(title);
    this._lastUpdate = new Date();
  }

  /**
   * @throws {z.ZodError<ReconstituteFilterQueryInput>} when newQueryInput doesn't match filterQuerySchema
   */
  updateQuery(newQueryInput: ReconstituteFilterQueryInput) {
    this._query = FilterQuery.of(filterQuerySchema.parse(newQueryInput));
    this._lastUpdate = new Date();
  }
}
