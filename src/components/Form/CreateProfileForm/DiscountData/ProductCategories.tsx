import { FormGroup } from "design-react-kit";
import { Label } from "reactstrap";
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
          <FormGroup check tag="div" className="mt-4" key={i}>
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
            <Label check for={`${name}.${categoryKey}`} tag="label">
              <span className="fw-bold">
                {categoriesMap[categoryKey as ProductCategory].name}{" "}
              </span>{" "}
              <span className="fw-light text-secondary">
                {categoriesMap[categoryKey as ProductCategory].description}
              </span>
            </Label>
          </FormGroup>
        )
      )}
      <FormErrorMessage formLens={formLens.focus("productCategories")} />
    </>
  );
};

export default ProductCategories;
