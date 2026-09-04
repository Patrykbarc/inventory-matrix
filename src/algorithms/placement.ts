import { gridSize, isAreaFree } from "./grid.js";

import type { PlacementStrategy } from "./types.js";
import type { Coordinates, Item, ReadonlyMatrix } from "../types.js";

type ScanOrder = "column-first" | "row-first";

/**
 * Yields every origin where the item still fits inside the grid, so the
 * collision check never has to repeat the bounds test.
 */
function* candidateOrigins(
  grid: ReadonlyMatrix,
  item: Item,
  order: ScanOrder,
): Generator<Coordinates> {
  const { width, height } = gridSize(grid);
  const maxX = width - item.width;
  const maxY = height - item.height;

  if (order === "column-first") {
    for (let x = 0; x <= maxX; x++) {
      for (let y = 0; y <= maxY; y++) yield { x, y };
    }
    return;
  }

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) yield { x, y };
  }
}

const firstFit =
  (order: ScanOrder): PlacementStrategy =>
  (item, grid) => {
    for (const origin of candidateOrigins(grid, item, order)) {
      if (isAreaFree(grid, item, origin)) return origin;
    }

    return null;
  };

/**
 * Fills each column top-to-bottom before moving right. Packs tall, narrow
 * items (axe 1x4, sword 1x3) tightly, because small leftovers drop into the
 * pockets underneath them instead of spreading across the first row.
 */
const columnFirst = firstFit("column-first");

/**
 * Fills each row left-to-right before moving down. Mirror image of
 * `columnFirst`: better for wide, short items (shield 2x2).
 */
const rowFirst = firstFit("row-first");

export { columnFirst, rowFirst };
