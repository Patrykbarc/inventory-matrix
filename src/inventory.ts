import { randomUUID } from "node:crypto";

import type {
  AddResult,
  Coordinates,
  Item,
  ItemInstance,
  Matrix,
  PlacedItem,
} from "./types.js";

export class Inventory {
  public grid: Matrix;
  private instances: Map<string, ItemInstance> = new Map();

  constructor(
    private width: number,
    private height: number,
  ) {
    this.grid = this.createMatrix();
  }

  private createMatrix(): Matrix {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => null),
    );
  }

  public addItem(item: Item): AddResult {
    const slot = this.findFreeSlot(item);

    if (slot === null) return { ok: false, reason: "no-space" };

    const { x, y } = slot;
    const instanceId = randomUUID();
    this.instances.set(instanceId, { instanceId, item, x, y });

    for (let r = y; r < y + item.height; r++) {
      const gridRow = this.grid[r];
      if (!gridRow) continue;

      for (let c = x; c < x + item.width; c++) {
        gridRow[c] = instanceId;
      }
    }

    return { ok: true, instanceId };
  }

  public printMatrix(): void {
    const labels = new Map<string, string>();
    let n = 0;

    for (const { instanceId, item } of this.instances.values()) {
      labels.set(instanceId, `${item.id.slice(0, 3)}#${++n}`);
    }

    console.table(
      this.grid.map((row) =>
        row.map((cell) => (cell === null ? "x" : (labels.get(cell) ?? "?"))),
      ),
    );
  }

  private sortItems(): ItemInstance[] {
    const itemsToSort = [...this.instances.values()];

    const sortedItems = itemsToSort.sort((a, b) => {
      const categoryDiff = a.item.category.localeCompare(b.item.category);

      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      const areaA = a.item.width * a.item.height;
      const areaB = b.item.width * b.item.height;

      return areaB - areaA;
    });

    return sortedItems;
  }

  private canPlaceItem(placedItem: PlacedItem): boolean {
    const { item, x, y } = placedItem;

    if (
      x < 0 ||
      y < 0 ||
      x + item.width > this.width ||
      y + item.height > this.height
    ) {
      return false;
    }

    for (let r = y; r < y + item.height; r++) {
      const gridRow = this.grid[r];
      if (!gridRow) return false;

      for (let c = x; c < x + item.width; c++) {
        if (gridRow[c] !== null) {
          return false;
        }
      }
    }

    return true;
  }

  private findFreeSlot(item: Item): Coordinates | null {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.canPlaceItem({ item, x, y })) {
          return { x, y };
        }
      }
    }
    return null;
  }

  public repack(): void {
    const sortedItems = this.sortItems();

    const backupGrid = this.grid;
    const backupInstances = this.instances;

    this.grid = this.createMatrix();
    this.instances = new Map();

    try {
      sortedItems.forEach(({ item }) => {
        const result = this.addItem(item);

        if (!result.ok) {
          throw new Error(
            `Repack failed: item "${item.name}" (ID: ${item.id}) did not fit after sorting`,
          );
        }
      });
    } catch (error) {
      this.grid = backupGrid;
      this.instances = backupInstances;
      throw error;
    }
  }
}
