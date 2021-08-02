import { fromNullable } from "fp-ts/lib/Option";

const PRODUCT_CATEGORIES: any = {
  Entertainment: "Tempo libero",
  Travelling: "Viaggi Trasporti e Mobilità",
  FoodDrink: "Ristoranti e cucina",
  Services: "Servizi",
  Learning: "Istruzione e formazione",
  Hotels: "Hotel",
  Sports: "Sport",
  Health: "Salute e benessere",
  Shopping: "Shopping"
};

export function makeProductCategoriesString(productCategories: Array<string>) {
  return productCategories.map(
    (productCategory: any) => PRODUCT_CATEGORIES[productCategory]
  );
}

export const formatPercentage = (discountValue: number | undefined) => 
fromNullable(discountValue)
.map(value => `${value} %`)
.getOrElse("");
