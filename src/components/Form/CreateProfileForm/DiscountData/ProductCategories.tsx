import { FormControlLabel } from "@mui/material";
import { Lens } from "@hookform/lenses";
import { useWatch } from "react-hook-form";
import { categoriesMap } from "../../../../utils/strings";
import { ProductCategory } from "../../../../api/generated";
import { MAX_SELECTABLE_CATEGORIES } from "../../../../utils/constants";
import { DiscountFormInputValues } from "../../discountFormUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

type Props = {
  index?: number;
  formLens: Lens<DiscountFormInputValues>;
};

const ProductCategories = ({ index, formLens }: Props) => {
  const selectedCategories = useWatch(
    formLens.focus("productCategories").interop()
  );

  const hasIndex = index !== undefined;
  const name = hasIndex
    ? `discounts[${index}].productCategories`
    : `productCategories`;

  const selectedCategoryCount =
    Object.values(selectedCategories).filter(Boolean).length;

  return (
    <>
      {(Object.keys(categoriesMap) as Array<ProductCategory>).map(
        (categoryKey, i) => (
          <FormControlLabel
            key={i}
            sx={{ mt: 0.5, alignItems: "flex-start" }}
            control={
              <Field
                id={`${name}.${categoryKey}`}
                type="checkbox"
                formLens={
                  formLens
                    .focus("productCategories")
                    .focus(categoryKey) as Lens<boolean>
                }
                disabled={
                  selectedCategoryCount >= MAX_SELECTABLE_CATEGORIES &&
                  !selectedCategories[categoryKey]
                }
              />
            }
            label={
              <span>
                <span>
                  {categoriesMap[categoryKey as ProductCategory].name}{" "}
                </span>
                <span>
                  {categoriesMap[categoryKey as ProductCategory].description}
                </span>
              </span>
            }
          />
        )
      )}
      <FormErrorMessage formLens={formLens.focus("productCategories")} />
    </>
  );
};

export default ProductCategories;
