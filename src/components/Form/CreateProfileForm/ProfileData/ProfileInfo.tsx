import React from "react";
import { Field, ErrorMessage } from "formik";
import FormSection from "../../FormSection";
import InputField from "../../FormField";
import ToggleField from "../../ToggleField";

type Props = {
  formValues: any;
};

const ProfileInfo = ({ formValues }: Props) => (
  <FormSection hasIntroduction isVisible={false}>
    <InputField
      htmlFor="fullName"
      title="Denominazione e ragione sociale Operatore"
      description="Inserire il nome completo dell'Operatore"
      required
    >
      <Field id="fullName" name="fullName" type="text" disabled />
      <ErrorMessage name="fullName" />
    </InputField>
    <ToggleField
      htmlFor="hasDifferentFullName"
      text="Vuoi visualizzare un nome diverso dentro l’app?"
    >
      <Field
        id="hasDifferentFullName"
        name="hasDifferentFullName"
        type="checkbox"
      />
    </ToggleField>
    {formValues.hasDifferentFullName && (
      <InputField
        htmlFor="name"
        title="Nome Operatore visualizzato"
        description="Può essere una semplificazione del nome dell'Operatore più riconoscibile dall'utente (es. PagoPA vs PagoPA SPA)"
        isVisible
        required
      >
        <Field id="name" name="name" type="text" />
        <ErrorMessage name="name" />
      </InputField>
    )}
    <InputField
      htmlFor="taxCodeOrVat"
      title="Codice fiscale / Partita IVA"
      required
    >
      <Field id="taxCodeOrVat" name="taxCodeOrVat" type="text" disabled />
      <ErrorMessage name="taxCodeOrVat" />
    </InputField>
    <InputField htmlFor="pecAddress" title="Indirizzo PEC" required>
      <Field
        id="pecAddress"
        name="pecAddress"
        type="email"
        placeholder="Inserisci l'indirizzo pec dell'organizzazione"
      />
      <ErrorMessage name="pecAddress" />
    </InputField>
    <InputField htmlFor="legalOffice" title="Sede legale" required>
      <Field
        id="legalOffice"
        name="legalOffice"
        type="text"
        placeholder="Inserisci l’indirizzo pec dell’organizzazione"
      />
      <ErrorMessage name="legalOffice" />
    </InputField>
    <InputField htmlFor="telephoneNumber" title="Numero di telefono" required>
      <Field
        id="telephoneNumber"
        name="telephoneNumber"
        type="text"
        placeholder="Inserisci il numero di telefono dell’organizzazione"
      />
      <ErrorMessage name="telephoneNumber" />
    </InputField>
    <InputField
      htmlFor="legalRepresentativeFullName"
      title="Nome e cognome del Legale rappresentante"
      required
    >
      <Field
        id="legalRepresentativeFullName"
        name="legalRepresentativeFullName"
        type="text"
        placeholder="Inserisci il nome e cognome del Legale rappresentante dell’organizzazione"
      />
      <ErrorMessage name="legalRepresentativeFullName" />
    </InputField>
    <InputField
      htmlFor="legalRepresentativeTaxCode"
      title="Codice fiscale del Legale rappresentante"
      required
    >
      <Field
        id="legalRepresentativeTaxCode"
        name="legalRepresentativeTaxCode"
        type="text"
        placeholder="Inserisci il Codice fiscale del Legale rappresentante dell’organizzazione"
      />
       <ErrorMessage name="legalRepresentativeTaxCode" />
    </InputField>
  </FormSection>
);

export default ProfileInfo;
