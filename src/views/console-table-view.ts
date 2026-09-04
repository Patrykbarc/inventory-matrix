import type { InventoryView } from "./types.js";
import type { InventorySnapshot } from "../types.js";

const EMPTY_CELL = "x";
const UNKNOWN_CELL = "?";

const buildLabels = (
  instances: InventorySnapshot["instances"],
): Map<string, string> => {
  const labels = new Map<string, string>();
  let n = 0;

  for (const { instanceId, item } of instances) {
    labels.set(instanceId, `${item.id.slice(0, 3)}#${++n}`);
  }

  return labels;
};

const renderConsoleTable: InventoryView = ({ grid, instances }) => {
  const labels = buildLabels(instances);

  console.table(
    grid.map((row) =>
      row.map((cell) =>
        cell === null ? EMPTY_CELL : (labels.get(cell) ?? UNKNOWN_CELL),
      ),
    ),
  );
};

export { renderConsoleTable };
