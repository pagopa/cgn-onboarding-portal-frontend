import React from "react";
import { Field } from "formik";
import { FormGroup } from "design-react-kit";
import { Label } from "reactstrap";
import CustomErrorMessage from "../../CustomErrorMessage";
import { categoriesMap } from "../../../../utils/strings";
import { ProductCategory } from "../../../../api/generated";
import { MAX_SELECTABLE_CATEGORIES } from "../../../../utils/constants";

type Props = {
  selectedCategories?: Array<ProductCategory>;
  index?: number;
};

const ProductCategories = ({ selectedCategories, index }: Props) => {
  const hasIndex = index !== undefined;
  const name = hasIndex
    ? `discounts[${index}].productCategories`
    : `productCategories`;

  const nameLabelStyle = {
    fontWeight: 700,
    marginRight: "5px",
    marginBottom: 0
  };

  const isCheckboxDisabled = (category: ProductCategory) =>
    selectedCategories &&
    selectedCategories.length >= MAX_SELECTABLE_CATEGORIES &&
    !selectedCategories.includes(category);

  return (
    <>
      {Object.keys(categoriesMap).map((categoryKey, i) => (
        <FormGroup check tag="div" className="mt-4" key={i}>
          <Field
            id={`${name}.${categoryKey}`}
            name={name}
            disabled={isCheckboxDisabled(categoryKey as ProductCategory)}
            value={categoryKey}
            type="checkbox"
          />
          <Label
            check
            for={`${name}.${categoryKey}`}
            tag="label"
            style={{ height: "auto" }}
          >
            <div className="row ml-1">
              <p style={nameLabelStyle}>
                {categoriesMap[categoryKey as ProductCategory].name}{" "}
              </p>{" "}
              {categoriesMap[categoryKey as ProductCategory].description}
            </div>
          </Label>
        </FormGroup>
      ))}
      <CustomErrorMessage name={name} />
    </>
  );
};

export default ProductCategories;
