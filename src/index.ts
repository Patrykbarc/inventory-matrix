type Item = {
  id: string;
  name: string;
  width: number;
  height: number;
};

type PlacedItem = {
  item: Item;
  x: number;
  y: number;
};

type Cell = Item["id"] | null;
type Matrix = Cell[][];

class Inventory {
  private grid: Matrix;
  private items: Map<string, PlacedItem> = new Map();

  constructor(
    private width: number,
    private height: number,
  ) {
    this.grid = this.createMatrix();
  }

  private createMatrix(): Matrix {
    return Array.from({ length: this.height }, () => {
      return Array.from({ length: this.width }, () => null);
    });
  }

  private canPlaceItem({ item, x, y }: PlacedItem): boolean {
    if (x < 0 || y < 0 || x + item.width > this.width || y + item.height > this.height) {
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

  public addItem({ item, x, y }: PlacedItem): boolean {
    if (!this.canPlaceItem({ item, x, y })) {
      throw new Error(`Cannot place item "${item.name}" (ID: ${item.id}) at position (${x}, ${y})`);
    }

    this.items.set(item.name, { item, x, y });

    for (let offsetY = 0; offsetY < item.height; offsetY++) {
      const gridRow = this.grid[y + offsetY];
      if (!gridRow) continue;

      for (let offsetX = 0; offsetX < item.width; offsetX++) {
        gridRow[x + offsetX] = item.id;
      }
    }
    console.table(this.grid);

    return true;
  }
}

const item: Item = {
  id: "item-1",
  name: "item-1",
  width: 1,
  height: 4,
};

const inventory = new Inventory(12, 5);
inventory.addItem({ item, x: 0, y: 0 });
