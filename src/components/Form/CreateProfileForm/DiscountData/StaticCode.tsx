import React from "react";
import { Field } from "formik";
import InputField from "../../FormField";
import CustomErrorMessage from "../../CustomErrorMessage";

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
      <CustomErrorMessage
        name={hasIndex ? `discounts[${index}].staticCode` : "staticCode"}
      />
      {children}
    </>
  );
};

export default StaticCode;
