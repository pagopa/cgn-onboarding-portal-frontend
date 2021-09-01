import React from "react";
import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";
import FormSection from "../../FormSection";

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
          value="API"
        />
        <label className="text-sm font-weight-normal text-black" htmlFor="api">
          <span className="text-sm">
            <a href="#">API</a>: implementerò sul mio portale di e-commerce le
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
          value="Static"
        />
        <label
          className="text-sm font-weight-normal text-black"
          htmlFor="staticCode"
        >
          <span className="text-sm">
            <a href="#">Con codice statico</a>: assocerò ad ogni agevolazione un
            codice statico che verrà letto e accettato dai miei sistemi
          </span>
        </label>
      </div>
      <div className="form-check">
        <Field
          id="landingPage"
          type="radio"
          name="salesChannel.discountCodeType"
          value="LandingPage"
        />
        <label
          className="text-sm font-weight-normal text-black"
          htmlFor="landingPage"
        >
          <span className="text-sm">
            <a href="#">Con link a landing page</a>: fornirò per ogni
            agevolazione un link con cui il cittadino che accede proveniendo da IO
            potrà usufruire degli sconti.
          </span>
        </label>
      </div>
      <CustomErrorMessage name={`salesChannel.discountCodeType`} />
    </div>
  </FormSection>
);

export default SalesChannelDiscountCodeType;
