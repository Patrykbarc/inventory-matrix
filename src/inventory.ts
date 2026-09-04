import { randomUUID } from "node:crypto";

import {
  clearArea,
  createMatrix,
  fillArea,
  gridSize,
} from "./algorithms/grid.js";

import type { PlacementStrategy, RepackOrder } from "./algorithms/types.js";
import type {
  AddResult,
  Coordinates,
  InstanceId,
  InventorySnapshot,
  Item,
  ItemInstance,
  Matrix,
} from "./types.js";

export class Inventory {
  private grid: Matrix;
  private instances: Map<string, ItemInstance> = new Map();

  constructor(
    width: number,
    height: number,
    private placement: PlacementStrategy,
  ) {
    this.grid = createMatrix({ width, height });
  }

  public snapshot(): InventorySnapshot {
    return {
      grid: this.grid.map((row) => [...row]),
      instances: [...this.instances.values()],
    };
  }

  private place(item: Item, instanceId: InstanceId["instanceId"]): boolean {
    const slot = this.placement(item, this.grid);

    if (slot === null) return false;

    this.instances.set(instanceId, { instanceId, item, ...slot });
    fillArea(this.grid, item, slot, instanceId);

    return true;
  }

  public addItem(item: Item): AddResult {
    const instanceId = randomUUID();

    if (!this.place(item, instanceId)) {
      return { ok: false, reason: "no-space" };
    }

    return { ok: true, instanceId };
  }

  public removeItem(instanceId: InstanceId["instanceId"]): boolean {
    const instance = this.instances.get(instanceId);

    if (instance === undefined) return false;

    clearArea(this.grid, instance.item, instance);
    this.instances.delete(instanceId);

    return true;
  }

  public removeAt({ x, y }: Coordinates): boolean {
    const instanceId = this.grid[y]?.[x];

    if (!instanceId) return false;

    return this.removeItem(instanceId);
  }

  public repack(order: RepackOrder): void {
    const sortedItems = [...this.instances.values()].sort(order);

    const backupGrid = this.grid;
    const backupInstances = this.instances;

    this.grid = createMatrix(gridSize(this.grid));
    this.instances = new Map();

    try {
      sortedItems.forEach(({ item, instanceId }) => {
        if (!this.place(item, instanceId)) {
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
