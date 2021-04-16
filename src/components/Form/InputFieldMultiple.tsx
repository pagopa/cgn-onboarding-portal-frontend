import React from "react";
import Field from "formik";
import VisibleIcon from "../../assets/icons/visible.svg";

type Props = {
  htmlFor: string;
  title?: string;
  description?: string;
  children: React.ReactElement<typeof Field>;
  required?: boolean;
  isVisible?: boolean;
};

const InputFieldMultiple = ({
  htmlFor,
  title,
  description,
  children,
  required = false,
  isVisible = false
}: Props) => (
  <>
    <label htmlFor={htmlFor}>
      <span className="d-flex flex-row align-items-center">
        <span className="text-base font-weight-bold mr-4">
          {title}
          {required && "*"}
        </span>
        {isVisible && <VisibleIcon />}
      </span>

      {description && (
        <p className="mt-2 text-sm font-weight-normal text-black">
          {description}
        </p>
      )}
    </label>
    {children}
  </>
);

export default InputFieldMultiple;
