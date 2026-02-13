import { Lens } from "@hookform/lenses";
import { DiscountFormInputValues } from "../../discountFormUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

type Props = {
  children?: React.ReactNode;
  formLens: Lens<DiscountFormInputValues>;
};

function LandingPage({ formLens, children }: Props) {
  return (
    <>
      <Field
        id="landing"
        formLens={formLens.focus("landingPageUrl")}
        placeholder="Inserisci indirizzo (completo di protocollo https)"
        type="text"
        maxLength={500}
        className="form-control"
      />
      <FormErrorMessage formLens={formLens.focus("landingPageUrl")} />
      <p className="mt-4 text-sm fw-normal text-black">
        Inserisci il valore del parametro referrer da trasmettere alla pagina
        web (max 100 caratteri)
      </p>
      <Field
        id="referrer"
        formLens={formLens.focus("landingPageReferrer")}
        placeholder="Inserisci valore referrer"
        type="text"
        maxLength={100}
        className="form-control"
      />
      <FormErrorMessage formLens={formLens.focus("landingPageReferrer")} />
      {children}
    </>
  );
}

export default LandingPage;
