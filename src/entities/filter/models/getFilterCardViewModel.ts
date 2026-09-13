import { getProjectColorHex, type Project } from "@/entities/project";
import type { Task } from "@/entities/task";
import type { FilterQuery } from "./filter-query";
import { getCardPriority, PRIORITY_COLORS } from "./priorityColors";

export type FilterCardViewModel = {
  filterId: number;
  filterTitle: string;
  taskTitle: string | null;
  remainingCount: number;
  priorityColor: string;
  projectName: string | null;
  projectColor: string | null;
};

type GetFilterCardViewModelParams = {
  filterId: number;
  filterTitle: string;
  query: FilterQuery;
  tasks: Task[];
  projects: Project[];
};

export const getFilterCardViewModel = ({
  filterId,
  filterTitle,
  query,
  tasks,
  projects,
}: GetFilterCardViewModelParams): FilterCardViewModel => {
  const matchingTasks = tasks.filter((task) => query.satisfiesFilter(task));
  const [firstTask] = matchingTasks;
  const project = query.project
    ? (projects.find((p) => p.id === query.project?.id) ?? null)
    : null;

  return {
    filterId,
    filterTitle,
    taskTitle: firstTask?.content ?? null,
    remainingCount: Math.max(matchingTasks.length - 1, 0),
    priorityColor: PRIORITY_COLORS[getCardPriority(query.priorities)],
    projectName: project?.name ?? null,
    projectColor: project ? getProjectColorHex(project.color) : null,
  };
};
