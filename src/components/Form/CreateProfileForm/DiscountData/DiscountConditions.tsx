import { Lens } from "@hookform/lenses";
import { DiscountFormInputValues } from "../../discountFormUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

type Props = {
  formLens: Lens<DiscountFormInputValues>;
};

function DiscountConditions({ formLens }: Props) {
  return (
    <div className="row">
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Italiano 🇮🇹</p>
        <Field
          element="textarea"
          id="condition"
          formLens={formLens.focus("condition")}
          placeholder="Es. Sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro."
          maxLength={200}
          rows={4}
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("condition")} />
      </div>
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
        <Field
          element="textarea"
          id="condition_en"
          formLens={formLens.focus("condition_en")}
          placeholder="Ex. Discount valid for the purchase of only one prose season ticket at the theatre’s counters "
          maxLength={200}
          rows={4}
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("condition_en")} />
      </div>
    </div>
  );
}

export default DiscountConditions;
