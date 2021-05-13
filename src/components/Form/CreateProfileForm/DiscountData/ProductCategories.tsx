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
      <FormGroup check tag="div">
        <Field
          id={`${name}.travels`}
          name={name}
          value="Travels"
          type="checkbox"
        />
        <Label check for={`${name}.travels`} tag="label">
          Viaggi
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
          id={`${name}.entertainments`}
          name={name}
          value="Entertainments"
          type="checkbox"
        />
        <Label check for={`${name}.entertainments`} tag="label">
          Teatro, cinema e spettacolo
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field
          id={`${name}.transportation`}
          name={name}
          value="Transportation"
          type="checkbox"
        />
        <Label check for={`${name}.transportation`} tag="label">
          Carsharing e mobilità
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field
          id={`${name}.connectivity`}
          name={name}
          value="Connectivity"
          type="checkbox"
        />
        <Label check for={`${name}.connectivity`} tag="label">
          Telefonia, servizi internet
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field id={`${name}.books`} name={name} value="Books" type="checkbox" />
        <Label check for={`${name}.books`} tag="label">
          Libri, audiolibri, e-book
        </Label>
      </FormGroup>
      <FormGroup check tag="div" className="mt-4">
        <Field id={`${name}.arts`} name={name} value="Arts" type="checkbox" />
        <Label check for={`${name}.arts`} tag="label">
          Musei, gallerie e parchi
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
      <CustomErrorMessage name={name} />
    </>
  );
};

export default ProductCategories;
