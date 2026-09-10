import type { SQLiteDatabase } from "expo-sqlite";
import { mapProjectToProjectRow } from "../lib/map-projects";
import type { Project } from "../model/project";

export const upsertProjects = async (
  db: SQLiteDatabase,
  projects: Project[],
): Promise<void> => {
  await db.withTransactionAsync(async () => {
    for (const project of projects) {
      const row = mapProjectToProjectRow(project);

      await db.runAsync(
        `--sql
        INSERT INTO projects (id, name, color)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          color = excluded.color
        `,
        row.id,
        row.name,
        row.color,
      );
    }
  });
};
