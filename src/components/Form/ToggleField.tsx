import React from "react";
import Field from "formik";

type Props = {
  htmlFor: string;
  text: string;
  children: React.ReactElement<typeof Field>;
  small?: boolean;
  required?: boolean;
};

const ToggleField = ({ htmlFor, text, children, small }: Props) => (
  <div className="mt-10 row">
    <div className={`form-check ${small ? "col-6": "col-10"}`}>
      <label htmlFor={htmlFor}>
        <span className="text-base font-weight-normal text-black">
          {text}
        </span>
      </label>
    </div>
    <div className={`form-check ${small ? "col-3": "col-2"}`}>
      <div className="toggles">
        <label>
          {children}
          <span className="lever"></span>
        </label>
      </div>
    </div>
  </div>
);

export default ToggleField;
