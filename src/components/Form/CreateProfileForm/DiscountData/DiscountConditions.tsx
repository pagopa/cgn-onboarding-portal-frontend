import React from "react";
import { Field } from "formik";
import { Button } from "design-react-kit";
import FormSection from "../../FormSection";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import FieldError from "../../FieldError";

type Props = {
  errors: any;
  touched: any;
};

const DiscountConditions = ({ errors, touched }: Props) => (
  <FormSection
    title="Condizioni dell’agevolazione"
    description="Descrivere eventuali limitazioni relative all’agevolazione (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
    isVisible
  >
    <Field
      as="textarea"
      id="condition"
      name="condition"
      placeholder="Inserisci una descrizione"
      maxLength="200"
      rows="4"
    />
    <FieldError errors={errors.conditions} touched={errors.touched} />
  </FormSection>
);

/* 

{handleBack && handleNext && (
      <>
        <div className="mt-10">
          <PlusCircleIcon className="mr-2" />
          <span className="text-base font-weight-semibold text-blue">
            Aggiungi un&apos;altra agevolazione
          </span>
        </div>
        <div className="mt-10">
          <button
            type="button"
            className="btn btn-outline-primary mt-9 px-14 mr-4"
            onClick={handleBack}
          >
            Indietro
          </button>
          <Button tag="button" handleNext={handleNext}>
            Continua
          </Button>
        </div>
      </>
    )}
  
    */

export default DiscountConditions;
