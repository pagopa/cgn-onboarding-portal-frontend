const PRODUCT_CATEGORIES: any = {
  Entertainments: "Teatro, cinema e spettacolo",
  Travels: "Viaggi",
  Transportation: "Carsharing, mobilità",
  Connectivity: "Telefonia, servizi internet",
  Books: "Libri, audiolibri, e-book",
  Arts: "Musei, gallerie, parchi",
  Sports: "Sport",
  Health: "Salute e benessere"
};

export function makeProductCategoriesString(productCategories: Array<string>) {
  return productCategories.map(
    (productCategory: any) => PRODUCT_CATEGORIES[productCategory]
  );
}
