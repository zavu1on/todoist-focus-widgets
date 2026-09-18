import type { SQLiteDatabase } from "expo-sqlite";
import { requestPinWidget } from "react-native-android-widget";
import { setPendingWidgetFilterId } from "@/entities/filter";

export const pinFilterWidget = async (
  db: SQLiteDatabase,
  filterId: number,
): Promise<void> => {
  await setPendingWidgetFilterId(db, filterId);
  await requestPinWidget({ widgetName: "Pin" });
};
