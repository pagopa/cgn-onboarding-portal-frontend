import React from "react";
import { Field } from "formik";
import InputField from "../../FormField";
import FieldError from "../../FieldError";

type Props = {
  errors: any;
  touched: any;
  children?: any;
};

const StaticCode = ({ errors, touched, children }: Props) => (
  <>
    <InputField htmlFor="staticCode">
      <Field id="staticCode" name="staticCode" type="text" />
    </InputField>
    <FieldError errors={errors.staticCode} touched={errors.touched} />
    {children}
  </>
);

export default StaticCode;
