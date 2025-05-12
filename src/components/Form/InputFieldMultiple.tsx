import { ReactNode } from "react";
import VisibleIcon from "../../assets/icons/visible.svg?react";

type Props = {
  htmlFor: string;
  title?: string;
  description?: string;
  children?: ReactNode;
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
    <label htmlFor={htmlFor} className="form-label">
      <span className="d-flex flex-row align-items-center">
        <span className="text-base fw-bold me-4">
          {title}
          {required && "*"}
        </span>
        {isVisible && <VisibleIcon />}
      </span>

      {description && (
        <p className="mt-2 text-sm fw-normal text-black">{description}</p>
      )}
    </label>
    {children}
  </>
);

export default InputFieldMultiple;
