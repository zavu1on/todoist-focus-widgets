import { Priority } from "@/entities/task";

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.URGENT]: "#D1453B",
  [Priority.HIGH]: "#EB8909",
  [Priority.MEDIUM]: "#246FE0",
  [Priority.NORMAL]: "#E0E0E0",
};

export const getCardPriority = (priorities: Priority[]): Priority =>
  priorities.length > 0
    ? (Math.max(...priorities) as Priority)
    : Priority.NORMAL;
