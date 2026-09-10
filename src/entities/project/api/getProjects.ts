import type { SQLiteDatabase } from "expo-sqlite";
import { mapProjectRowToProject } from "../lib/map-projects";
import type { Project } from "../model/project";
import type { ProjectRow } from "./createProjectsTable";

export const getProjects = async (db: SQLiteDatabase): Promise<Project[]> => {
  const result = await db.getAllAsync<ProjectRow>("SELECT * FROM projects");

  return result.map(mapProjectRowToProject);
};
