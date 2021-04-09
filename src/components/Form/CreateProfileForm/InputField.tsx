import React from "react";
import Field from "formik";

type Props = {
  htmlFor: string;
  title: string;
  description?: string;
  children: React.ReactElement<typeof Field>;
  required?: boolean;
};

const InputField = ({
  htmlFor,
  title,
  description,
  children,
  required = false
}: Props) => (
  <div className="mt-10 row">
    <div className="col-6">
      <label htmlFor={htmlFor}>
        <span className="text-base font-weight-bold">
          {title}
          {required && "*"}
        </span>
        {description && (
          <p className="mt-2 text-sm font-weight-normal text-black">
            {description}
          </p>
        )}
      </label>
      {children}
    </div>
  </div>
);

export default InputField;
