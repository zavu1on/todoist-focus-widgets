import { Priority } from "@/entities/task";
import { colors } from "@/shared/ui";

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.URGENT]: colors.danger,
  [Priority.HIGH]: colors.warning,
  [Priority.MEDIUM]: colors.info,
  [Priority.NORMAL]: colors.neutral,
};

export const getCardPriority = (priorities: Priority[]): Priority =>
  priorities.length > 0
    ? (Math.max(...priorities) as Priority)
    : Priority.NORMAL;
