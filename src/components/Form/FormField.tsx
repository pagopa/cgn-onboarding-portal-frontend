import VisibleIcon from "../../assets/icons/visible.svg?react";

type Props = {
  htmlFor: string;
  isTitleHeading?: boolean;
  title?: string;
  description?: string | React.ReactElement;
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
  <div className="mt-10">
    <div>
      <label htmlFor={htmlFor} className="form-label">
        <span className="d-flex flex-row align-items-center">
          <span
            className={
              isTitleHeading
                ? "h4 fw-bold text-dark-blue me-4"
                : "text-base fw-bold me-4"
            }
          >
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
    </div>
  </div>
);

export default FormField;
