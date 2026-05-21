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
    <label htmlFor={htmlFor}>
      <span>
        <span>
          {title}
          {required && "*"}
        </span>
        {isVisible && <VisibleIcon />}
      </span>

      {description && <p>{description}</p>}
    </label>
    {children}
  </>
);

export default InputFieldMultiple;
