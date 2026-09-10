import type { SQLiteDatabase } from "expo-sqlite";
import { mapLabelRowToLabel } from "../lib/map-labels";
import type { Label } from "../model/label";
import type { LabelRow } from "./createLabelsTable";

export const getLabels = async (db: SQLiteDatabase): Promise<Label[]> => {
  const result = await db.getAllAsync<LabelRow>("SELECT * FROM labels");

  return result.map(mapLabelRowToLabel);
};
