import type { Filter } from "@/entities/filter";
import type { Project } from "@/entities/project";
import type { Task } from "@/entities/task";
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

export const getFilterCardViewModel = (
  filter: Filter,
  tasks: Task[],
  projects: Project[],
): FilterCardViewModel => {
  const matchingTasks = tasks.filter((task) =>
    filter.query.satisfiesFilter(task),
  );
  const [firstTask] = matchingTasks;
  const project =
    projects.find((p) => p.id === filter.query.project.id) ?? null;

  return {
    filterId: filter.id,
    filterTitle: filter.title,
    taskTitle: firstTask?.content ?? null,
    remainingCount: Math.max(matchingTasks.length - 1, 0),
    priorityColor: PRIORITY_COLORS[getCardPriority(filter.query.priorities)],
    projectName: project?.name ?? null,
    projectColor: project?.color ?? null,
  };
};
