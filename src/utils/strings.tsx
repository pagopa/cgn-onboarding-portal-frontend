export function makeProductCategoriesString(productCategories: Array<string>) {
  if (productCategories.length === 1) {return productCategories[0];}
  const firsts = productCategories.slice(0, productCategories.length - 1);
  const last = productCategories[productCategories.length - 1];
  return firsts.join(", ") + " e " + last;
}
