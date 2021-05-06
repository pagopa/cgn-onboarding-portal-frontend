import React from "react";
import Field from "formik";
import VisibleIcon from "../../assets/icons/visible.svg";

type Props = {
  htmlFor: string;
  isTitleHeading?: boolean;
  title?: string;
  description?: string;
  children: any;
  required?: boolean;
  isVisible?: boolean;
};

const FormField = ({
  htmlFor,
  isTitleHeading = false,
  title,
  description,
  children,
  required = false,
  isVisible = false
}: Props) => (
  <div className="mt-10 row">
    <div className="col-8">
      <label htmlFor={htmlFor}>
        <span className="d-flex flex-row align-items-center">
          <span
            className={
              isTitleHeading
                ? "h4 font-weight-bold text-dark-blue mr-4"
                : "text-base font-weight-bold mr-4"
            }
          >
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
    </div>
  </div>
);

export default FormField;
