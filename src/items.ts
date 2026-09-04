import type { Item } from "./types.js";

const axeItem: Item = {
  id: "axe",
  name: "Axe",
  width: 1,
  height: 4,
  category: "weapon",
};

const swordItem: Item = {
  id: "sword",
  name: "Sword",
  width: 1,
  height: 3,
  category: "weapon",
};

const glyphItem: Item = {
  id: "glyph",
  name: "Glyph",
  width: 1,
  height: 1,
  category: "glyph",
};

const potionItem: Item = {
  id: "potion",
  name: "Potion",
  width: 1,
  height: 1,
  category: "potion",
};

const shieldItem: Item = {
  id: "shield",
  name: "Shield",
  width: 2,
  height: 2,
  category: "weapon",
};

export { axeItem, swordItem, glyphItem, potionItem, shieldItem };
