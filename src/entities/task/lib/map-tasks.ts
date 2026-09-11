import type { Project } from "@/entities/project";
import type { TaskRow } from "../api/createTasksTable";
import type { Priority } from "../model/priority";
import { Task } from "../model/task";
import type { TodoistSyncItem } from "../model/todoist-sync-item";

export const mapSyncItemToTask = (
  item: TodoistSyncItem,
  project: Project,
): Task =>
  Task.create({
    id: item.id,
    content: item.content,
    project,
    priority: item.priority as Priority,
    due: item.due,
    checked: item.checked,
    url: item.url,
    labels: item.labels,
  });

export const mapTaskRowToTask = (row: TaskRow, project: Project): Task =>
  Task.reconstitute({
    id: row.id,
    content: row.content,
    project,
    priority: row.priority as Priority,
    dueJsonString: row.due,
    checked: Boolean(row.checked),
    url: row.url,
    labelsJsonString: row.labels,
  });

export const mapTaskToTaskRow = (task: Task): TaskRow => ({
  id: task.id,
  content: task.content,
  project_id: task.project.id,
  priority: task.priority,
  due: task.due === null ? null : JSON.stringify(task.due),
  checked: task.checked ? 1 : 0,
  url: task.url,
  labels: JSON.stringify(task.labels),
});
