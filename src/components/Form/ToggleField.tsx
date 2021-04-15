import React from "react";
import Field from "formik";

type Props = {
  htmlFor: string;
  text: string;
  children: React.ReactElement<typeof Field>;
  required?: boolean;
};

const ToggleField = ({ htmlFor, text, children }: Props) => (
  <div className="mt-10 row">
    <div className="form-check col-7">
      <div className="toggles">
        <label htmlFor={htmlFor}>
          <span className="text-base font-weight-normal text-black">
            {text}
          </span>
          {children}
          <span className="lever"></span>
        </label>
      </div>
    </div>
  </div>
);

export default ToggleField;
