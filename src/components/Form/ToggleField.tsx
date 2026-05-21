import { Field } from "../../utils/react-hook-form-helpers";

type Props = {
  htmlFor: string;
  text: string;
  children: React.ReactElement<typeof Field>;
  small?: boolean;
  required?: boolean;
};

const ToggleField = ({ htmlFor, text, children }: Props) => (
  <div>
    <div>
      <label htmlFor={htmlFor}>
        <span>{text}</span>
      </label>
    </div>
    <div>
      <div>
        <label style={{ height: "min-content" }}>
          {children}
          <span></span>
        </label>
      </div>
    </div>
  </div>
);

export default ToggleField;
