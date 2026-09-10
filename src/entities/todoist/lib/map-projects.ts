import type { ProjectRow } from "../api/createProjectsTable";
import { Project } from "../model/project";

export const mapProjectRowToProject = (row: ProjectRow): Project =>
  Project.reconstitute({
    id: row.id,
    name: row.name,
    color: row.color,
  });

export const mapProjectToProjectRow = (project: Project): ProjectRow => ({
  id: project.id,
  name: project.name,
  color: project.color,
});
