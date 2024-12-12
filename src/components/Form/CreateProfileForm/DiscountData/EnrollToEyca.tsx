import React from "react";
import { Field } from "formik";
import { FormGroup } from "design-react-kit";
import FormField from "../../FormField";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  isEycaSupported: boolean;
  discountOption: string;
  index?: number;
};

const EnrollToEyca = ({ index, isEycaSupported, discountOption }: Props) => {
  const hasIndex = index !== undefined;

  return (
    <>
      <FormField
        htmlFor={hasIndex ? `eycaLandingPageUrl${index}` : "eycaLandingPageUrl"}
        isTitleHeading
        title="Vuoi che questa opportunità sia visibile su EYCA?"
        description={
          isEycaSupported ? (
            <>
              Se vuoi che questa opportunità sia visibile anche sul portale di
              EYCA, ti consigliamo di inserire una URL della landing page in
              inglese da cui potranno accedere esclusivamente i beneficiari di
              EYCA. Per maggiori informazioni, consulta la{" "}
              <a
                className="font-weight-semibold"
                href="https://docs.pagopa.it/carta-giovani-nazionale"
                target="_blank"
                rel="noreferrer"
              >
                Documentazione tecnica
              </a>
              .
            </>
          ) : (
            <>
              La modalità {discountOption} non è al momento compatibile con
              EYCA. <br /> Puoi comunque manifestare il tuo interesse ad aderire
              e definire i dettagli con il Dipartimento in un secondo momento.
              <br /> Per maggiori informazioni, consultare la{" "}
              <a
                className="font-weight-semibold"
                href="https://docs.pagopa.it/carta-giovani-nazionale"
                target="_blank"
                rel="noreferrer"
              >
                Documentazione tecnica
              </a>
            </>
          )
        }
      >
        <FormGroup check tag="div" className="mt-4">
          <Field
            id="eycaLandingPageUrl"
            name={
              hasIndex
                ? `discounts[${index}].eycaLandingPageUrl`
                : "eycaLandingPageUrl"
            }
            placeholder="Inserisci indirizzo (completo di protocollo http o https)"
            type="text"
          />
          <CustomErrorMessage
            name={
              hasIndex
                ? `discounts[${index}].eycaLandingPageUrl`
                : "eycaLandingPageUrl"
            }
          />
        </FormGroup>
      </FormField>
    </>
  );
};

export default EnrollToEyca;
