import type {
  Coordinates,
  Item,
  ItemInstance,
  ReadonlyMatrix,
} from "../types.js";

type PlacementStrategy = (
  item: Item,
  grid: ReadonlyMatrix,
) => Coordinates | null;

type RepackOrder = (a: ItemInstance, b: ItemInstance) => number;

export { type PlacementStrategy, type RepackOrder };
