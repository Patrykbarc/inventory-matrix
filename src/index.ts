import { Inventory } from "./inventory.js";
import { axeItem, glyphItem, potionItem, swordItem } from "./items.js";

const inventory = new Inventory(12, 5);

const itemsToAdd = [
  axeItem,
  swordItem,
  swordItem,
  glyphItem,
  glyphItem,
  potionItem,
];

for (const item of itemsToAdd) {
  const result = inventory.addItem(item);

  if (!result.ok) {
    console.warn(`Skipped "${item.name}": ${result.reason}`);
  }
}

inventory.printMatrix();
inventory.repack();
inventory.printMatrix();
