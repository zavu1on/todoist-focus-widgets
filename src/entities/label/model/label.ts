import z from "zod";

export const createLabelInputSchema = z.object({
  id: z
    .string("Label id must be a text value.")
    .min(1, "Label id can't be empty."),
  name: z
    .string("Label name must be a text value.")
    .min(1, "Label name can't be empty."),
  color: z
    .string("Label color must be a text value.")
    .min(1, "Label color can't be empty."),
});

export type CreateLabelInput = z.infer<typeof createLabelInputSchema>;

export class Label {
  private _name: string;
  private _color: string;

  private constructor(
    readonly id: string,
    name: string,
    color: string,
  ) {
    this._name = name;
    this._color = color;
  }

  get name(): string {
    return this._name;
  }

  get color(): string {
    return this._color;
  }

  /**
   * Creates a new label from a Todoist sync label.
   *
   * @throws {z.ZodError<CreateLabelInput>} when input doesn't match createLabelInputSchema
   */
  static create(input: CreateLabelInput): Label {
    const validInput = createLabelInputSchema.parse(input);

    return new Label(validInput.id, validInput.name, validInput.color);
  }

  /** Rebuilds a label from a database row: all fields are trusted as already valid. */
  static reconstitute(input: CreateLabelInput): Label {
    return new Label(input.id, input.name, input.color);
  }
}
