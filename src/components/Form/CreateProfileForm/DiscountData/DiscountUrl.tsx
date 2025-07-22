import { Lens } from "@hookform/lenses";
import { DiscountFormInputValues } from "../../discountFormUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

type Props = {
  formLens: Lens<DiscountFormInputValues>;
};

function DiscountUrl({ formLens }: Props) {
  return (
    <>
      <Field
        id="discountUrl"
        formLens={formLens.focus("discountUrl")}
        type="text"
        placeholder="Inserisci link (completo di protocollo http o https)"
        className="form-control"
      />
      <FormErrorMessage formLens={formLens.focus("discountUrl")} />
    </>
  );
}

export default DiscountUrl;
