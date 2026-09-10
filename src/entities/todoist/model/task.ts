import z from "zod";
import { type Priority, prioritySchema } from "./priority";
import { Project } from "./project";

const dueSchema = z
  .object({
    isRecurring: z.boolean("Task due isRecurring must be a boolean value."),
    string: z.string("Task due string must be a text value."),
    date: z.string("Task due date must be a text value."),
    datetime: z.string().nullable().optional(),
    timezone: z.string().nullable().optional(),
    lang: z.string().nullable().optional(),
  })
  .nullable();

export type Due = z.infer<typeof dueSchema>;

const labelsSchema = z.array(z.string("Task label must be a text value."));

export const createTaskInputSchema = z.object({
  id: z
    .string("Task id must be a text value.")
    .min(1, "Task id can't be empty."),
  content: z.string("Task content must be a text value."),
  project: z.custom<Project>((value) => value instanceof Project, {
    message: "Task project must be a Project instance.",
  }),
  priority: prioritySchema,
  due: dueSchema,
  checked: z.boolean("Task checked must be a boolean value."),
  url: z
    .string("Task url must be a text value.")
    .min(1, "Task url can't be empty."),
  labels: labelsSchema,
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const taskSyncPayloadSchema = createTaskInputSchema.omit({ id: true });

export type TaskSyncPayload = z.infer<typeof taskSyncPayloadSchema>;

const reconstituteTaskInputSchema = z.object({
  id: z.string(),
  content: z.string(),
  project: z.custom<Project>((value) => value instanceof Project),
  priority: prioritySchema,
  dueJsonString: z.string().nullable(),
  checked: z.boolean(),
  url: z.string(),
  labelsJsonString: z.string(),
});

export type ReconstituteTaskInput = z.infer<typeof reconstituteTaskInputSchema>;

export class Task {
  private _content: string;
  private _project: Project;
  private _priority: Priority;
  private _due: Due;
  private _checked: boolean;
  private _url: string;
  private _labels: string[];

  private constructor(
    readonly id: string,
    content: string,
    project: Project,
    priority: Priority,
    due: Due,
    checked: boolean,
    url: string,
    labels: string[],
  ) {
    this._content = content;
    this._project = project;
    this._priority = priority;
    this._due = due;
    this._checked = checked;
    this._url = url;
    this._labels = labels;
  }

  get content(): string {
    return this._content;
  }

  get project(): Project {
    return this._project;
  }

  get priority(): Priority {
    return this._priority;
  }

  get due(): Due {
    return this._due;
  }

  get checked(): boolean {
    return this._checked;
  }

  get url(): string {
    return this._url;
  }

  get labels(): string[] {
    return [...this._labels];
  }

  /**
   * Creates a new task from a Todoist sync item, given its already resolved project.
   *
   * @throws {z.ZodError<CreateTaskInput>} when input doesn't match createTaskInputSchema
   */
  static create(input: CreateTaskInput): Task {
    const validInput = createTaskInputSchema.parse(input);

    return new Task(
      validInput.id,
      validInput.content,
      validInput.project,
      validInput.priority,
      validInput.due,
      validInput.checked,
      validInput.url,
      validInput.labels,
    );
  }

  /**
   * Rebuilds a task from a database row: id/content/project/priority/checked/url are trusted
   * as already valid, while dueJsonString and labelsJsonString are decoded and validated, since
   * a stored JSON blob has to be parsed regardless of how much the source is trusted.
   *
   * @throws {z.ZodError<Due>} when dueJsonString is not valid JSON, or its content doesn't match the due schema
   * @throws {z.ZodError<string[]>} when labelsJsonString is not valid JSON, or its content isn't an array of strings
   */
  static reconstitute(input: ReconstituteTaskInput): Task {
    let parsedDue: unknown = null;

    if (input.dueJsonString !== null) {
      try {
        parsedDue = JSON.parse(input.dueJsonString);
      } catch {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Task due must be a valid JSON string.",
            path: [],
            input: input.dueJsonString,
          },
        ]) as z.ZodError<Due>;
      }
    }

    let parsedLabels: unknown;

    try {
      parsedLabels = JSON.parse(input.labelsJsonString);
    } catch {
      throw new z.ZodError([
        {
          code: "custom",
          message: "Task labels must be a valid JSON string.",
          path: [],
          input: input.labelsJsonString,
        },
      ]) as z.ZodError<string[]>;
    }

    return new Task(
      input.id,
      input.content,
      input.project,
      input.priority,
      dueSchema.parse(parsedDue),
      input.checked,
      input.url,
      labelsSchema.parse(parsedLabels),
    );
  }

  /**
   * Overwrites every field from a new sync delta payload, since the Todoist Sync API always
   * sends the whole current state of a task, never a partial patch.
   *
   * @throws {z.ZodError<TaskSyncPayload>} when payload doesn't match taskSyncPayloadSchema
   */
  updateFromSync(payload: TaskSyncPayload) {
    const validPayload = taskSyncPayloadSchema.parse(payload);

    this._content = validPayload.content;
    this._project = validPayload.project;
    this._priority = validPayload.priority;
    this._due = validPayload.due;
    this._checked = validPayload.checked;
    this._url = validPayload.url;
    this._labels = validPayload.labels;
  }
}
