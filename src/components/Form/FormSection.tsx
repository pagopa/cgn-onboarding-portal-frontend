import { Icon } from "design-react-kit";
import { ReactNode } from "react";
import VisibleIcon from "../../assets/icons/visible.svg?react";

type Props = {
  hasIntroduction?: boolean;
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  required?: boolean;
  isVisible?: boolean;
  footerDescription?: ReactNode;
  className?: string;
  hasClose?: boolean;
  handleClose?(): void;
  hasRemove?: boolean;
  onRemove?(): void;
};

const FormAlertInfoContent = () => (
  <p className="alert alert-primary mb-10 text-base font-weight-normal text-black">
    Le domande contrassegnate con il simbolo * sono obbligatorie
    <br /> Le informazioni contrassegnate con il simbolo <VisibleIcon /> saranno
    visibili in app.
  </p>
);

const FormSection = ({
  hasIntroduction = false,
  title,
  description,
  required = false,
  isVisible = true,
  footerDescription = "",
  children,
  className = "",
  hasClose = false,
  handleClose,
  hasRemove = false,
  onRemove
}: Props) => (
  <section className={`${className} mt-4 container bg-white`}>
    <div className="row" style={{ position: "relative" }}>
      {hasRemove && (
        <Icon
          icon="it-close"
          className="cursor-pointer"
          size="xl"
          onClick={onRemove}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            fill: "#0073E5"
          }}
        />
      )}
      <div className="col-10 offset-1 py-8">
        {hasIntroduction && (
          <>
            {hasClose && (
              <div className="d-flex flex-row justify-content-between">
                <FormAlertInfoContent />
                <Icon
                  icon="it-close"
                  className="cursor-pointer"
                  onClick={handleClose}
                />
              </div>
            )}
            {!hasClose && <FormAlertInfoContent />}
          </>
        )}
        {title && (
          <div className="d-flex flex-row align-items-center">
            <h1 className="h4 fw-bold text-dark-blue me-4">
              {title}
              {required && "*"}
            </h1>
            {isVisible && <VisibleIcon />}
          </div>
        )}
        {description && (
          <p className="text-sm fw-normal text-black">{description}</p>
        )}
        {children}
        {footerDescription !== "" && footerDescription}
      </div>
    </div>
  </section>
);

export default FormSection;
