type Category = "weapon" | "potion" | "glyph";

type Item = {
  id: string;
  name: string;
  width: number;
  height: number;
  category: Category;
};

type Coordinates = {
  x: number;
  y: number;
};

type PlacedItem = {
  item: Item;
} & Coordinates;

type InstanceId = {
  instanceId: string;
};

type ItemInstance = PlacedItem & InstanceId;

type Cell = InstanceId["instanceId"] | null;

type Matrix = Cell[][];

type ReadonlyMatrix = readonly (readonly Cell[])[];

type InventorySnapshot = {
  grid: ReadonlyMatrix;
  instances: readonly ItemInstance[];
};

type AddResult =
  | { ok: true; instanceId: InstanceId["instanceId"] }
  | { ok: false; reason: "no-space" };

export {
  type Cell,
  type Matrix,
  type ReadonlyMatrix,
  type InventorySnapshot,
  type PlacedItem,
  type ItemInstance,
  type Item,
  type Coordinates,
  type AddResult,
  type InstanceId,
};
