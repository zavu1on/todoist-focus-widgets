import type { SQLiteDatabase } from "expo-sqlite";
import type { Project } from "@/entities/project";
import { getProjects } from "@/entities/project";
import { mapTaskRowToTask } from "../lib/map-tasks";
import type { Task } from "../model/task";
import type { TaskRow } from "./createTasksTable";

export const getTasks = async (db: SQLiteDatabase): Promise<Task[]> => {
  const [taskRows, projects] = await Promise.all([
    db.getAllAsync<TaskRow>("SELECT * FROM tasks"),
    getProjects(db),
  ]);

  const projectsById = new Map<string, Project>(
    projects.map((project) => [project.id, project]),
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
