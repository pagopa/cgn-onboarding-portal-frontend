import React from "react";
import { ErrorMessage, Field } from "formik";
import { FormGroup } from "design-react-kit";
import { Label } from "reactstrap";
import { PropsOf } from "io-ts";

type Props = {
  index?: number;
};

const ProductCategories = ({ index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <>
      <FormGroup check tag="div">
        <Field
          id="travels"
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
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
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
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
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
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
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
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
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
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
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
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
        <Field
          id="arts"
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
          value="ARTS"
          type="checkbox"
        />
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
          name={
            hasIndex
              ? `discounts[${index}].productCategories`
              : `productCategories`
          }
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
      <ErrorMessage
        name={
          hasIndex
            ? `discounts[${index}].productCategories`
            : `productCategories`
        }
      />
    </>
  );
};

export default ProductCategories;
