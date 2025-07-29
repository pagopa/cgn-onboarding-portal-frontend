import { ReactNode } from "react";
import { Lens } from "@hookform/lenses";
import { DiscountFormInputValues } from "../../discountFormUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

type Props = {
  children?: ReactNode;
  formLens: Lens<DiscountFormInputValues>;
};

function StaticCode({ formLens, children }: Props) {
  return (
    <div>
      <Field
        placeholder="Inserisci codice statico"
        id="staticCode"
        formLens={formLens.focus("staticCode")}
        type="text"
        className="form-control"
      />
      <FormErrorMessage formLens={formLens.focus("staticCode")} />
      {children}
    </div>
  );
}

export default StaticCode;
