import React from "react";
import Field from "formik";

type Props = {
  htmlFor: string;
  text: string;
  children: React.ReactElement<typeof Field>;
  required?: boolean;
};

const CheckboxField = ({ htmlFor, text, children }: Props) => (
  <div className="mt-9">
    {children}
    <label className="ml-4" htmlFor={htmlFor}>
      {text}
    </label>
  </div>
);

export default CheckboxField;
