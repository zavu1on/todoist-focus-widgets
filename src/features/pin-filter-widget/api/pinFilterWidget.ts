import type { SQLiteDatabase } from "expo-sqlite";
import { requestPinWidget } from "react-native-android-widget";
import { addPendingWidgetFilterId } from "@/entities/filter";

export const pinFilterWidget = async (
  db: SQLiteDatabase,
  filterId: number,
): Promise<void> => {
  await addPendingWidgetFilterId(db, filterId);
  await requestPinWidget({ widgetName: "Pin" });
};
