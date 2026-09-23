import { QueryClient } from "@tanstack/react-query";
import type { WidgetTaskHandler } from "react-native-android-widget";
import {
  deleteWidgetFilterId,
  popPendingWidgetFilterId,
  upsertWidgetFilterId,
} from "@/entities/filter";
import { getDatabase } from "@/features/database";
import { renderSingleWidget } from "../lib";

const queryClient = new QueryClient();

export const widgetTaskHandler: WidgetTaskHandler = async (props) => {
  try {
    const db = await getDatabase();

    // the logic is now implemented only for the "Pin" widget
    switch (props.widgetAction) {
      case "WIDGET_ADDED": {
        const filterId = await popPendingWidgetFilterId(db);
        if (filterId === null) return;

        await upsertWidgetFilterId(db, props.widgetInfo.widgetId, filterId);
        await renderSingleWidget(db, queryClient, props);

        return;
      }
      case "WIDGET_DELETED":
        await deleteWidgetFilterId(db, props.widgetInfo.widgetId);
        return;
      case "WIDGET_UPDATE":
        await renderSingleWidget(db, queryClient, props);
        return;
      case "WIDGET_CLICK":
        if (props.clickAction === "RELOAD") {
          await renderSingleWidget(db, queryClient, props);
        }
        return;
      case "WIDGET_RESIZED":
        return;
    }
  } catch (error) {
    console.error(error);
  }
};
