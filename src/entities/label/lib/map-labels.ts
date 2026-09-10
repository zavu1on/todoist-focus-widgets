import type { LabelRow } from "../api/createLabelsTable";
import { Label } from "../model/label";

export const mapLabelRowToLabel = (row: LabelRow): Label =>
  Label.reconstitute({
    id: row.id,
    name: row.name,
    color: row.color,
  });

export const mapLabelToLabelRow = (label: Label): LabelRow => ({
  id: label.id,
  name: label.name,
  color: label.color,
});
