import z from "zod";

export const createProjectInputSchema = z.object({
  id: z
    .string("Project id must be a text value.")
    .min(1, "Project id can't be empty."),
  name: z
    .string("Project name must be a text value.")
    .min(1, "Project name can't be empty."),
  color: z
    .string("Project color must be a text value.")
    .min(1, "Project color can't be empty."),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const projectSyncPayloadSchema = createProjectInputSchema.omit({
  id: true,
});

export type ProjectSyncPayload = z.infer<typeof projectSyncPayloadSchema>;

export class Project {
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
   * Creates a new project from a Todoist sync project.
   *
   * @throws {z.ZodError<CreateProjectInput>} when input doesn't match createProjectInputSchema
   */
  static create(input: CreateProjectInput): Project {
    const validInput = createProjectInputSchema.parse(input);

    return new Project(validInput.id, validInput.name, validInput.color);
  }

  /** Rebuilds a project from a database row: all fields are trusted as already valid. */
  static reconstitute(input: CreateProjectInput): Project {
    return new Project(input.id, input.name, input.color);
  }

  /**
   * Overwrites every field from a new sync delta payload, since the Todoist Sync API always
   * sends the whole current state of a project, never a partial patch.
   *
   * @throws {z.ZodError<ProjectSyncPayload>} when payload doesn't match projectSyncPayloadSchema
   */
  updateFromSync(payload: ProjectSyncPayload) {
    const validPayload = projectSyncPayloadSchema.parse(payload);

    this._name = validPayload.name;
    this._color = validPayload.color;
  }
}
