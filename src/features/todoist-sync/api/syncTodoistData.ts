import type { SyncLabel } from "@doist/todoist-sdk";
import type { SQLiteDatabase } from "expo-sqlite";
import {
  deleteLabels,
  getLabels,
  type Label,
  mapSyncLabelToLabel,
  upsertLabels,
} from "@/entities/label";
import {
  deleteProjects,
  getProjects,
  mapSyncProjectToProject,
  type Project,
  type TodoistSyncProject,
  upsertProjects,
} from "@/entities/project";
import {
  deleteTasks,
  getTasks,
  mapSyncItemToTask,
  setSyncToken,
  type Task,
  type TodoistSyncItem,
  upsertTasks,
} from "@/entities/task";
import { syncTodoist } from "./syncTodoist";

type SyncedData = {
  tasks: Task[];
  projects: Project[];
  labels: Label[];
};

const partitionByDeleted = <T extends { isDeleted?: boolean }>(
  items: T[],
): { toDelete: T[]; toUpsert: T[] } => ({
  toDelete: items.filter((item) => item.isDeleted === true),
  toUpsert: items.filter((item) => item.isDeleted !== true),
});

const requireProject = (
  projectById: Map<string, Project>,
  item: TodoistSyncItem,
): Project => {
  const project = projectById.get(item.projectId);

  if (!project) {
    throw new Error(`Task "${item.id}" references an unknown project.`);
  }

  return project;
};

/**
 * Fetches the latest Todoist sync data and reconciles it into SQLite, then returns the
 * canonical local state. A full sync replaces everything; a delta partitions each resource
 * into deletions and upserts, since the Sync API always sends whole entities, never patches.
 *
 * Projects are written and re-read before tasks are mapped, since a task needs its already
 * resolved Project instance, not just a raw project id.
 *
 * The new sync token is only persisted once every local write succeeds, so a failed sync
 * retries against the same full/delta state instead of skipping it.
 */
export const syncTodoistData = async (
  db: SQLiteDatabase,
  accessToken: string,
): Promise<SyncedData> => {
  const result = await syncTodoist(accessToken);
  let projects: Project[];

  try {
    if (result.type === "full") {
      await upsertLabels(db, result.labels.map(mapSyncLabelToLabel));
      await upsertProjects(db, result.projects.map(mapSyncProjectToProject));
    } else {
      const labels = partitionByDeleted<SyncLabel>(result.labels);
      const projects = partitionByDeleted<TodoistSyncProject>(result.projects);

      await deleteLabels(
        db,
        labels.toDelete.map((label) => label.id),
      );
      await upsertLabels(db, labels.toUpsert.map(mapSyncLabelToLabel));
      await deleteProjects(
        db,
        projects.toDelete.map((project) => project.id),
      );
      await upsertProjects(db, projects.toUpsert.map(mapSyncProjectToProject));
    }

    projects = await getProjects(db);
    const projectById = new Map(
      projects.map((project) => [project.id, project]),
    );

    if (result.type === "full") {
      const tasks = result.items.map((item) =>
        mapSyncItemToTask(item, requireProject(projectById, item)),
      );

      await upsertTasks(db, tasks);
    } else {
      const items = partitionByDeleted<TodoistSyncItem>(result.items);

      await deleteTasks(
        db,
        items.toDelete.map((item) => item.id),
      );
      await upsertTasks(
        db,
        items.toUpsert.map((item) =>
          mapSyncItemToTask(item, requireProject(projectById, item)),
        ),
      );
    }

    await setSyncToken(result.syncToken);
  } catch (error) {
    throw new Error(
      "Failed to save the synced Todoist data locally. Please try again.",
      { cause: error },
    );
  }

  const [tasks, labels] = await Promise.all([getTasks(db), getLabels(db)]);

  return { tasks, projects, labels };
};
