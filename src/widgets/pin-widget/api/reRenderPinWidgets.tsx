import type { SQLiteDatabase } from "expo-sqlite";
import { requestWidgetUpdate } from "react-native-android-widget";
import {
  getFilterCardViewModel,
  getFilters,
  getWidgetFilterIds,
} from "@/entities/filter";
import { getProjects } from "@/entities/project";
import { getTasks } from "@/entities/task";
import { PinWidget } from "../ui";

export const reRenderPinWidgets = async (db: SQLiteDatabase): Promise<void> => {
  const [filters, tasks, projects, widgetFilterIds] = await Promise.all([
    getFilters(db),
    getTasks(db),
    getProjects(db),
    getWidgetFilterIds(db),
  ]);

  // updates all "Pin" widgets
  await requestWidgetUpdate({
    widgetName: "Pin",
    renderWidget: (widgetInfo) => {
      const filterId = widgetFilterIds.get(widgetInfo.widgetId);
      const filter =
        filterId === undefined
          ? undefined
          : filters.find((candidate) => candidate.id === filterId);

      if (filter === undefined) {
        return <PinWidget errorMessage="Filter was removed." />;
      }

      const viewModel = getFilterCardViewModel({
        filterId: filter.id,
        filterTitle: filter.title,
        query: filter.query,
        tasks,
        projects,
      });

      return <PinWidget viewModel={viewModel} />;
    },
  });
};
