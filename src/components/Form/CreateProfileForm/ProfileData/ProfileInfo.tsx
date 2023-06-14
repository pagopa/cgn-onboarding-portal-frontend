import { Field } from "formik";
import React from "react";
import CustomErrorMessage from "../../CustomErrorMessage";
import InputField from "../../FormField";
import FormSection from "../../FormSection";
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
      <CustomErrorMessage name="fullName" />
    </InputField>
    <ToggleField
      small={true}
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
        htmlFor="profileName"
        title="Nome Operatore visualizzato"
        description={<>Può essere una semplificazione del nome dell'Operatore più riconoscibile dall'utente (es. PagoPA vs PagoPA SPA) <br/>Il nome dell'operatore deve rispettare l'uso delle maiuscole previste del proprio brand name (es. PagoPA vs PAGOPA)</>}
        isVisible
        required
      >
        <div className="row">
          <div className="col-6">
            <p className="text-sm font-weight-normal text-black mb-0">
              Italiano 🇮🇹
            </p>
            <Field id="name" name="name" type="text" />
            <CustomErrorMessage name="name" />
          </div>
          <div className="col-6">
            <p className="text-sm font-weight-normal text-black mb-0">
              Inglese 🇬🇧
            </p>
            <Field id="name_en" name="name_en" type="text" />
            <CustomErrorMessage name="name_en" />
          </div>
        </div>
      </InputField>
    )}
    <InputField
      htmlFor="taxCodeOrVat"
      title="Codice fiscale / Partita IVA"
      required
    >
      <Field id="taxCodeOrVat" name="taxCodeOrVat" type="text" disabled />
      <CustomErrorMessage name="taxCodeOrVat" />
    </InputField>
    <InputField htmlFor="pecAddress" title="Indirizzo PEC" required>
      <Field
        id="pecAddress"
        name="pecAddress"
        type="email"
        placeholder="Inserisci l'indirizzo pec dell'organizzazione"
      />
      <CustomErrorMessage name="pecAddress" />
    </InputField>
    <InputField htmlFor="legalOffice" title="Sede legale" required>
      <Field
        id="legalOffice"
        name="legalOffice"
        type="text"
        placeholder="Inserisci la sede legale dell’organizzazione"
      />
      <CustomErrorMessage name="legalOffice" />
    </InputField>
    <InputField
      htmlFor="telephoneNumber"
      title="Numero di telefono Operatore"
      required
    >
      <Field
        maxLength={15}
        id="telephoneNumber"
        name="telephoneNumber"
        type="text"
        placeholder="Inserisci il numero di telefono dell’organizzazione"
      />
      <CustomErrorMessage name="telephoneNumber" />
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
      <CustomErrorMessage name="legalRepresentativeFullName" />
    </InputField>
    <InputField
      htmlFor="legalRepresentativeTaxCode"
      title="Codice fiscale del Legale rappresentante"
      required
    >
      <Field
        minLength={4}
        maxLength={20}
        id="legalRepresentativeTaxCode"
        name="legalRepresentativeTaxCode"
        type="text"
        placeholder="Inserisci il Codice fiscale del Legale rappresentante dell’organizzazione"
      />
      <CustomErrorMessage name="legalRepresentativeTaxCode" />
    </InputField>
  </FormSection>
);

export default ProfileInfo;
