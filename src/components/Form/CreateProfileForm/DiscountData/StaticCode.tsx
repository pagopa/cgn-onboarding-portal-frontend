import React from "react";
import { Field } from "formik";
import FormSection from "../../FormSection";
import InputField from "../../InputField";
import FieldError from "../../FieldError";

type Props = {
  errors: any;
  touched: any;
  children: any;
};

const StaticCode = ({ errors, touched, children }: Props) => (
  <FormSection
    title="Codice statico"
    description="Inserire il codice relativo all’agevolazione che l’utente dovrà inserire sul vostro portale online*"
    isVisible
  >
    <InputField htmlFor="staticCode">
      <Field id="staticCode" name="staticCode" type="text" />
    </InputField>
    <FieldError errors={errors.staticCode} touched={errors.touched} />
    {children}
  </FormSection>
);

export default StaticCode;
