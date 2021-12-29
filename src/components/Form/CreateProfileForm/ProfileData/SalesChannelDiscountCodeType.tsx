import React from "react";
import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";
import FormSection from "../../FormSection";
import { DiscountCodeType } from "../../../../api/generated";

const SalesChannelDiscountCodeType = () => (
  <FormSection
    title="Modalità di validazione dei codici sconto online"
    description="Le modalità possibili sono definite nella Documentazione Tecnica. Seleziona una delle opzioni disponibili"
    required
    isVisible={false}
  >
    <div className="d-flex flex-column">
      <div className="form-check">
        <Field
          id="api"
          type="radio"
          name="salesChannel.discountCodeType"
          value={DiscountCodeType.Api}
        />
        <label className="text-sm font-weight-normal text-black" htmlFor="api">
          <span className="text-sm">
            <a href="https://docs.pagopa.it/documentazione-tecnica-portale-operatori-1.0.0/attuazione-della-convenzione/online-modello-api" target="_blank" rel="noreferrer">API</a>: implementerò sul mio portale di e-commerce le
            integrazioni tecniche necessarie a validare i codici inseriti dai
            beneficiari, chiamando le API messe a disposizione da PagoPA per
            verificare la validità dei codici in tempo reale.
          </span>
        </label>
      </div>
      <div className="form-check">
        <Field
          id="staticCode"
          type="radio"
          name="salesChannel.discountCodeType"
          value={DiscountCodeType.Static}
        />
        <label
          className="text-sm font-weight-normal text-black"
          htmlFor="staticCode"
        >
          <span className="text-sm">
            <a href="https://docs.pagopa.it/documentazione-tecnica-portale-operatori-1.0.0/attuazione-della-convenzione/online-codice-sconto-statico" target="_blank" rel="noreferrer">Con codice statico</a>: assocerò ad ogni agevolazione un
            codice statico che verrà letto e accettato dai miei sistemi
          </span>
        </label>
      </div>
      <div className="form-check">
        <Field
          id="bucket"
          type="radio"
          name="salesChannel.discountCodeType"
          value={DiscountCodeType.Bucket}
        />
        <label
          className="text-sm font-weight-normal text-black"
          htmlFor="bucket"
        >
          <span className="text-sm">
            <a href="https://docs.pagopa.it/documentazione-tecnica-portale-operatori-1.0.0/attuazione-della-convenzione/online-lista-di-codici-statici-bucket" target="_blank" rel="noreferrer">Con lista di codici statici</a>: assocerò ad ogni
            agevolazione una lista di codici statici che verranno letti e
            accettati dai miei sistemi e che mi impegno a caricare
            periodicamente, consapevole del fatto che, se si esaurissero,
            l’agevolazione sarebbe sospesa
          </span>
        </label>
      </div>
      <div className="form-check">
        <Field
          id="landingPage"
          type="radio"
          name="salesChannel.discountCodeType"
          value={DiscountCodeType.LandingPage}
        />
        <label
          className="text-sm font-weight-normal text-black"
          htmlFor="landingPage"
        >
          <span className="text-sm">
            <a href="https://docs.pagopa.it/documentazione-tecnica-portale-operatori-1.0.0/attuazione-della-convenzione/online-landing-page" target="_blank" rel="noreferrer">Con link a landing page</a>: fornirò per ogni
            agevolazione un link con cui il cittadino che accede proveniendo da
            IO potrà usufruire degli sconti
          </span>
        </label>
      </div>
      <CustomErrorMessage name={`salesChannel.discountCodeType`} />
    </div>
  </FormSection>
);

export default SalesChannelDiscountCodeType;
