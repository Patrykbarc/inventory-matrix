import type {
  Cell,
  Coordinates,
  Item,
  Matrix,
  ReadonlyMatrix,
} from "../types.js";

type GridSize = {
  width: number;
  height: number;
};

const gridSize = (grid: ReadonlyMatrix): GridSize => ({
  width: grid[0]?.length ?? 0,
  height: grid.length,
});

const createMatrix = ({ width, height }: GridSize): Matrix =>
  Array.from({ length: height }, () =>
    Array.from({ length: width }, () => null),
  );

/**
 * Assumes the origin is in bounds — callers get their candidates from
 * `candidateOrigins`, which never yields one that overflows the grid.
 */
const isAreaFree = (
  grid: ReadonlyMatrix,
  item: Item,
  { x, y }: Coordinates,
): boolean => {
  for (let row = y; row < y + item.height; row++) {
    const gridRow = grid[row];
    if (!gridRow) return false;

    for (let col = x; col < x + item.width; col++) {
      if (gridRow[col] !== null) {
        return false;
      }
    }
  }

  return true;
};

const fillArea = (
  grid: Matrix,
  item: Item,
  { x, y }: Coordinates,
  value: Cell,
): void => {
  for (let row = y; row < y + item.height; row++) {
    const gridRow = grid[row];
    if (!gridRow) continue;

    for (let col = x; col < x + item.width; col++) {
      gridRow[col] = value;
    }
  }
};

const clearArea = (grid: Matrix, item: Item, origin: Coordinates): void => {
  fillArea(grid, item, origin, null);
};

export {
  type GridSize,
  gridSize,
  createMatrix,
  isAreaFree,
  fillArea,
  clearArea,
};
