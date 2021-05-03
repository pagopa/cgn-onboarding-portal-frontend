import React from "react";
import { Field } from "formik";
import FormSection from "../../FormSection";
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

export default DiscountConditions;
