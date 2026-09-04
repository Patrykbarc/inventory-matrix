import type { RepackOrder } from "./types.js";
import type { Item } from "../types.js";

const area = (item: Item): number => item.width * item.height;

const byCategoryThenArea: RepackOrder = (a, b) => {
  const categoryDiff = b.item.category.localeCompare(a.item.category);

  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return area(b.item) - area(a.item);
};

const byAreaDesc: RepackOrder = (a, b) => area(b.item) - area(a.item);

export { byCategoryThenArea, byAreaDesc };
