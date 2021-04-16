import React from "react";
import { Field } from "formik";
import { FormGroup, Input } from "design-react-kit";
import { Label } from "reactstrap";
import FormSection from "../../FormSection";
import CheckboxField from "../../CheckboxField";

type Props = {
  errors: any;
  touched: any;
  setFieldValue: any;
  formValues: any;
};

const ProductCategories = ({
  errors,
  touched,
  formValues,
  setFieldValue
}: Props) => (
  <>
    <FormGroup check tag="div">
      <Field
        id="travels"
        name="productCategories"
        value="TRAVELS"
        type="checkbox"
      />
      <Label
        check
        for="travels"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Viaggi
      </Label>
    </FormGroup>
    <FormGroup check tag="div" className="mt-4">
      <Field
        id="health"
        name="productCategories"
        value="HEALTH"
        type="checkbox"
      />
      <Label
        check
        for="health"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Salute e Benessere
      </Label>
    </FormGroup>
    <FormGroup check tag="div" className="mt-4">
      <Field
        id="entertainments"
        name="productCategories"
        value="ENTERTAINMENTS"
        type="checkbox"
      />
      <Label
        check
        for="entertainments"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Teatro, cinema e spettacolo
      </Label>
    </FormGroup>
    <FormGroup check tag="div" className="mt-4">
      <Field
        id="transportation"
        name="productCategories"
        value="TRANSPORTATION"
        type="checkbox"
      />
      <Label
        check
        for="transportation"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Carsharing e mobilità
      </Label>
    </FormGroup>
    <FormGroup check tag="div" className="mt-4">
      <Field
        id="connectivity"
        name="productCategories"
        value="CONNECTIVITY"
        type="checkbox"
      />
      <Label
        check
        for="connectivity"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Telefonia, servizi internet
      </Label>
    </FormGroup>
    <FormGroup check tag="div" className="mt-4">
      <Field
        id="books"
        name="productCategories"
        value="BOOKS"
        type="checkbox"
      />
      <Label
        check
        for="books"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Libri, audiolibri, e-book
      </Label>
    </FormGroup>
    <FormGroup check tag="div" className="mt-4">
      <Field id="arts" name="productCategories" value="ARTS" type="checkbox" />
      <Label
        check
        for="arts"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Musei, gallerie e parchi
      </Label>
    </FormGroup>
    <FormGroup check tag="div" className="mt-4">
      <Field
        id="sports"
        name="productCategories"
        value="SPORTS"
        type="checkbox"
      />
      <Label
        check
        for="sports"
        tag="label"
        widths={["xs", "sm", "md", "lg", "xl"]}
      >
        Sport
      </Label>
    </FormGroup>
  </>
);

export default ProductCategories;
