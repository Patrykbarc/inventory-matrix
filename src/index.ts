import { byCategoryThenArea } from "./algorithms/ordering.js";
import { columnFirst } from "./algorithms/placement.js";
import { Inventory } from "./inventory.js";
import { axeItem, glyphItem, potionItem, swordItem } from "./items.js";
import { renderConsoleTable } from "./views/console-table-view.js";

const inventory = new Inventory(12, 5, columnFirst);

const itemsToAdd = [
  axeItem,
  swordItem,
  swordItem,
  glyphItem,
  glyphItem,
  potionItem,
];

const addedIds: string[] = [];

for (const item of itemsToAdd) {
  const result = inventory.addItem(item);

  if (result.ok) {
    addedIds.push(result.instanceId);
  } else {
    console.warn(`Skipped "${item.name}": ${result.reason}`);
  }
}

renderConsoleTable(inventory.snapshot());
inventory.repack(byCategoryThenArea);

const [axeId] = addedIds;
if (axeId !== undefined)
  console.log("removeItem(axe):", inventory.removeItem(axeId));

console.log("removeAt(1,0):", inventory.removeAt({ x: 1, y: 0 }));
renderConsoleTable(inventory.snapshot());
