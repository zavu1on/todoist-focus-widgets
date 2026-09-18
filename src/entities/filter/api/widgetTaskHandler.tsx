import { openDatabaseAsync } from "expo-sqlite";
import type { WidgetTaskHandler } from "react-native-android-widget";
import { getProjects } from "@/entities/project";
import { getTasks } from "@/entities/task";
import { DATABASE_NAME } from "@/shared/api";
import { getFilterCardViewModel } from "../models/getFilterCardViewModel";
import { PinWidget } from "../ui/PinWidget";
import { getAndClearPendingWidgetFilterId } from "./getAndClearPendingWidgetFilterId";
import { getFilters } from "./getFilters";

export const widgetTaskHandler: WidgetTaskHandler = async (props) => {
  if (props.widgetAction !== "WIDGET_ADDED") {
    return;
  }

  const db = await openDatabaseAsync(DATABASE_NAME);

  try {
    const filterId = await getAndClearPendingWidgetFilterId(db);

    if (filterId === null) {
      return;
    }

    const [filters, tasks, projects] = await Promise.all([
      getFilters(db),
      getTasks(db),
      getProjects(db),
    ]);
    const filter = filters.find((candidate) => candidate.id === filterId);

    if (filter === undefined) {
      return;
    }

    const viewModel = getFilterCardViewModel({
      filterId: filter.id,
      filterTitle: filter.title,
      query: filter.query,
      tasks,
      projects,
    });

    props.renderWidget(<PinWidget viewModel={viewModel} />);
  } finally {
    await db.closeAsync();
  }
};
