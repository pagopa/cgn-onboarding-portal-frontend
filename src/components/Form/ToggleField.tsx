import { Field } from "../../utils/react-hook-form-helpers";

type Props = {
  htmlFor: string;
  text: string;
  children: React.ReactElement<typeof Field>;
  small?: boolean;
  required?: boolean;
};

const ToggleField = ({ htmlFor, text, children }: Props) => (
  <div className="d-flex justify-content-between align-items-center gap-2">
    <div className="form-check mb-0">
      <label htmlFor={htmlFor} className="form-label mb-0">
        <span className="text-base fw-normal text-black">{text}</span>
      </label>
    </div>
    <div className="form-check my-0">
      <div className="toggles">
        <label className="form-label mb-0" style={{ height: "min-content" }}>
          {children}
          <span className="lever mx-0 mt-2"></span>
        </label>
      </div>
    </div>
  </div>
);

export default ToggleField;
