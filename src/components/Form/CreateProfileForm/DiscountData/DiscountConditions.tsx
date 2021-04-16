import React from "react";
import { Field } from "formik";
import FieldError from "../../FieldError";

type Props = {
  errors: any;
  touched: any;
};

const DiscountConditions = ({ errors, touched }: Props) => (
  <>
    <Field
      as="textarea"
      id="condition"
      name="condition"
      placeholder="Inserisci una descrizione"
      maxLength="200"
      rows="4"
    />
    <FieldError errors={errors.conditions} touched={errors.touched} />
  </>
);

export default DiscountConditions;
