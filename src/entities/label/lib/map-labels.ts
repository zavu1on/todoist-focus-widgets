import type { LabelRow } from "../api/createLabelsTable";
import { Label } from "../model/label";
import type { SyncLabel } from "../model/sync-label";

export const mapSyncLabelToLabel = (syncLabel: SyncLabel): Label =>
  Label.create({
    id: syncLabel.id,
    name: syncLabel.name,
    color: syncLabel.color,
  });

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
