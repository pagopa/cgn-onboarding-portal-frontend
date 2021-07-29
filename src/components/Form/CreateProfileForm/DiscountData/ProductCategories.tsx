import React from "react";
import { Field } from "formik";
import { FormGroup } from "design-react-kit";
import { Label } from "reactstrap";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  index?: number;
};

const ProductCategories = ({ index }: Props) => {
  const hasIndex = index !== undefined;
  const name = hasIndex
    ? `discounts[${index}].productCategories`
    : `productCategories`;
  return (
    <>
      <FormGroup check tag="div" className="mt-4">
        <Field
          id={`${name}.entertainment`}
          name={name}
          value="Entertainment"
          type="checkbox"
        />
        <Label check for={`${name}.entertainment`} tag="label">
          Tempo libero
        </Label>
      </FormGroup>
      <FormGroup check tag="div">
        <Field
          id={`${name}.travelling`}
          name={name}
          value="Travelling"
          type="checkbox"
        />
        <Label check for={`${name}.travelling`} tag="label">
          Viaggi
        </Label>
      </FormGroup>
      <FormGroup check tag="div">
        <Field
          id={`${name}.foodDrink`}
          name={name}
          value="FoodDrink"
          type="checkbox"
        />
        <Label check for={`${name}.foodDrink`} tag="label">
          Ristoranti e cucina
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field
          id={`${name}.services`}
          name={name}
          value="Services"
          type="checkbox"
        />
        <Label check for={`${name}.services`} tag="label">
          Servizi
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field id={`${name}.learning`} name={name} value="Learning" type="checkbox" />
        <Label check for={`${name}.learning`} tag="label">
          Istruzione e formazione
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field id={`${name}.hotels`} name={name} value="Hotels" type="checkbox" />
        <Label check for={`${name}.hotels`} tag="label">
          Hotel
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field
          id={`${name}.sports`}
          name={name}
          value="Sports"
          type="checkbox"
        />
        <Label check for={`${name}.sports`} tag="label">
          Sport
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field
          id={`${name}.health`}
          name={name}
          value="Health"
          type="checkbox"
        />
        <Label check for={`${name}.health`} tag="label">
          Salute e Benessere
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field
          id={`${name}.shopping`}
          name={name}
          value="Shopping"
          type="checkbox"
        />
        <Label check for={`${name}.shopping`} tag="label">
          Shopping
        </Label>
      </FormGroup>
      <CustomErrorMessage name={name} />
    </>
  );
};

export default ProductCategories;
