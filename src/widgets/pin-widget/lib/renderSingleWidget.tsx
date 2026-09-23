import type { QueryClient } from "@tanstack/react-query";
import type { SQLiteDatabase } from "expo-sqlite";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import {
  getFilterCardViewModel,
  getFilters,
  getWidgetFilterIds,
} from "@/entities/filter";
import { getProjects } from "@/entities/project";
import { getTasks } from "@/entities/task";
import { getAccessToken } from "@/shared/api";
import { syncTodoistDataQuietly } from "../api/syncTodoistDataQuietly";
import { PinWidget } from "../ui";

export const renderSingleWidget = async (
  db: SQLiteDatabase,
  queryClient: QueryClient,
  props: WidgetTaskHandlerProps,
): Promise<void> => {
  const accessToken = await getAccessToken();

  if (accessToken === null) {
    props.renderWidget(
      <PinWidget errorMessage="Sign in to Todoist to see your tasks." />,
    );
    return;
  }

  await syncTodoistDataQuietly(db, queryClient, accessToken);

  const [filters, tasks, projects, widgetFilterIds] = await Promise.all([
    getFilters(db),
    getTasks(db),
    getProjects(db),
    getWidgetFilterIds(db),
  ]);

  const filterId = widgetFilterIds.get(props.widgetInfo.widgetId);
  const filter =
    filterId === undefined
      ? undefined
      : filters.find((candidate) => candidate.id === filterId);

  if (filter === undefined) {
    props.renderWidget(<PinWidget errorMessage="Filter was removed." />);
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
};
