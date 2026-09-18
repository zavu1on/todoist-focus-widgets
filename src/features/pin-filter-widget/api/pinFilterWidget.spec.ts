import type { SQLiteDatabase } from "expo-sqlite";
import { requestPinWidget } from "react-native-android-widget";
import { pinFilterWidget } from "./pinFilterWidget";

jest.mock("@/entities/filter", () => ({
  setPendingWidgetFilterId: jest.fn().mockResolvedValue(undefined),
}));

import { setPendingWidgetFilterId } from "@/entities/filter";

describe("pinFilterWidget", () => {
  it("marks the filter as pending before requesting the pin prompt", async () => {
    const db = {} as SQLiteDatabase;

    await pinFilterWidget(db, 42);

    expect(setPendingWidgetFilterId).toHaveBeenCalledWith(db, 42);
    expect(requestPinWidget).toHaveBeenCalledWith({ widgetName: "Pin" });
  });
});
