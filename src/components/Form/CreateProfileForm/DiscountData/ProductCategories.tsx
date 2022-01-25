import React from "react";
import { Field } from "formik";
import { FormGroup } from "design-react-kit";
import { Label } from "reactstrap";
import CustomErrorMessage from "../../CustomErrorMessage";
import { categoriesMap } from "../../../../utils/strings";

type Props = {
  index?: number;
};

const ProductCategories = ({ index }: Props) => {
  const hasIndex = index !== undefined;
  const name = hasIndex
    ? `discounts[${index}].productCategories`
    : `productCategories`;

  const nameLabelStyle = { fontWeight: 700, marginRight: "5px" };

  return (
    <>
      {Object.keys(categoriesMap).map((categoryKey, i) => (
        <FormGroup check tag="div" className="mt-4" key={i}>
          <Field
            id={`${name}.${categoryKey}`}
            name={name}
            value={categoryKey}
            type="checkbox"
          />
          <Label check for={`${name}.${categoryKey}`} tag="label">
            <div className="row ml-1">
              <p style={nameLabelStyle}>{categoriesMap[categoryKey].name} </p>{" "}
              {categoriesMap[categoryKey].description}
            </div>
          </Label>
        </FormGroup>
      ))}
      <CustomErrorMessage name={name} />
    </>
  );
};

export default ProductCategories;
