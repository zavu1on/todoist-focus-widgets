import type { SQLiteDatabase } from "expo-sqlite";
import { mapProjectRowToProject } from "../lib/map-projects";
import { mapTaskRowToTask } from "../lib/map-tasks";
import type { Project } from "../model/project";
import type { Task } from "../model/task";
import type { ProjectRow } from "./createProjectsTable";
import type { TaskRow } from "./createTasksTable";

export const getTasks = async (db: SQLiteDatabase): Promise<Task[]> => {
  const [taskRows, projectRows] = await Promise.all([
    db.getAllAsync<TaskRow>("SELECT * FROM tasks"),
    db.getAllAsync<ProjectRow>("SELECT * FROM projects"),
  ]);

  const projectsById = new Map<string, Project>(
    projectRows.map((row) => [row.id, mapProjectRowToProject(row)]),
  );

  return taskRows.map((row) => {
    const project = projectsById.get(row.project_id);

    if (project === undefined) {
      throw new Error(
        `Task ${row.id} references a missing project ${row.project_id}.`,
      );
    }

    return mapTaskRowToTask(row, project);
  });
};
