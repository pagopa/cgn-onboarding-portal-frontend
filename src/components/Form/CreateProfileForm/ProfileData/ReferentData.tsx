import React from "react";
import { Field, ErrorMessage } from "formik";
import FormSection from "../../FormSection";
import InputField from "../../FormField";

type Props = {
  children?: any;
};

const ReferentData = ({ children }: Props) => (
  <FormSection
    title="Dati e contatti del referente incaricato"
    description="Indicare il nome della persona responsabile del programma CGN per conto dell'Operatore"
    isVisible={false}
  >
    <InputField htmlFor="firstName" title="Nome" required>
      <Field id="referent.firstName" name="referent.firstName" type="text" />
      <ErrorMessage name="referent.firstName" />
    </InputField>
    <InputField htmlFor="referent.lastName" title="Cognome" required>
      <Field id="referent.lastName" name="referent.lastName" type="text" />
      <ErrorMessage name="referent.lastName" />
    </InputField>
    <InputField
      htmlFor="referent.role"
      title="Ruolo all'interno dell'azienda"
      required
    >
      <Field id="referent.role" name="referent.role" type="text" />
      <ErrorMessage name="referent.role" />
    </InputField>
    <InputField
      htmlFor="referent.emailAddress"
      title="Indirizzo e-mail"
      required
    >
      <Field
        id="referent.emailAddress"
        name="referent.emailAddress"
        type="email"
      />
      <ErrorMessage name="referent.email" />
    </InputField>
    <InputField
      htmlFor="referent.telephoneNumber"
      title="Numero di telefono"
      required
    >
      <Field
        id="referent.telephoneNumber"
        name="referent.telephoneNumber"
        type="tel"
        placeholder="Inserisci il numero di telefono"
      />
      <ErrorMessage name="referent.referent" />
    </InputField>
    {children}
  </FormSection>
);

export default ReferentData;
