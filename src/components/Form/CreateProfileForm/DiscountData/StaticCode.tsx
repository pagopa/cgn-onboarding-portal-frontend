import { Field } from "formik";
import { ReactNode } from "react";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  children?: ReactNode;
  index?: number;
};

const StaticCode = ({ children, index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <div>
      <Field
        placeholder="Inserisci codice statico"
        id="staticCode"
        name={hasIndex ? `discounts[${index}].staticCode` : "staticCode"}
        type="text"
        className="form-control"
      />
      <CustomErrorMessage
        name={hasIndex ? `discounts[${index}].staticCode` : "staticCode"}
      />
      {children}
    </div>
  );
};

export default StaticCode;
