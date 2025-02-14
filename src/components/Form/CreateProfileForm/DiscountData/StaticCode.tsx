import React from "react";
import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  children?: any;
  index?: number;
};

const StaticCode = ({ children, index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <div className="col-10">
      <Field
        id="staticCode"
        name={hasIndex ? `discounts[${index}].staticCode` : "staticCode"}
        type="text"
      />
      <CustomErrorMessage
        name={hasIndex ? `discounts[${index}].staticCode` : "staticCode"}
      />
      {children}
    </div>
  );
};

export default StaticCode;
