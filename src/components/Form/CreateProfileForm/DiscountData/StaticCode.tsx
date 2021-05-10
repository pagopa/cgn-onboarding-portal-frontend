import React from "react";
import { ErrorMessage, Field } from "formik";
import InputField from "../../FormField";

type Props = {
  children?: any;
  index?: number;
};

const StaticCode = ({ children, index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <>
      <InputField htmlFor="staticCode">
        <Field
          id="staticCode"
          name={hasIndex ? `discounts[${index}].staticCode` : "staticCode"}
          type="text"
        />
      </InputField>
      <ErrorMessage
        name={hasIndex ? `discounts[${index}].staticCode` : "staticCode"}
      />
      {children}
    </>
  );
};

export default StaticCode;
