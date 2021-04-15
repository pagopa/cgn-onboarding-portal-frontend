import React from "react";
import { Field } from "formik";
import { Link } from "react-router-dom";
import FormSection from "../FormSection";
import { ROOT } from "../../../navigation/routes";
import InputField from "../InputField";
import ToggleField from "../ToggleField";

const ProfileData = ({ formValues }: any) => (
  <FormSection hasIntroduction isVisible={false}>
    <InputField
      htmlFor="fullName"
      title="Denominazione e ragione sociale Operatore"
      description="Inserire il nome completo dell'Operatore"
      required
    >
      <Field id="fullName" name="fullName" type="text" disabled />
    </InputField>
    <ToggleField
      htmlFor="hasDifferentName"
      text="Vuoi visualizzare un nome diverso dentro l’app?"
    >
      <Field id="hasDifferentName" name="hasDifferentName" type="checkbox" />
    </ToggleField>
    {formValues.hasDifferentName && (
      <InputField
        htmlFor="name"
        title="Nome Operatore visualizzato"
        description="Può essere una semplificazione del nome dell'Operatore più riconoscibile dall'utente (es. PagoPA vs PagoPA SPA)"
        required
      >
        <Field id="name" name="name" type="text" />
      </InputField>
    )}
    <InputField
      htmlFor="taxCodeOrVat"
      title="Codice fiscale / Partita IVA"
      required
    >
      <Field id="taxCodeOrVat" name="taxCodeOrVat" type="text" disabled />
    </InputField>
    <InputField htmlFor="pecAddress" title="Indirizzo PEC" required>
      <Field
        id="pecAddress"
        name="pecAddress"
        type="email"
        placeholder="Inserisci l'indirizzo pec dell'organizzazione"
      />
    </InputField>
    <div className="row">
      <div className="col-6">
        <Link to={ROOT} className="btn btn-outline-primary mt-9 mr-2 px-14">
          Annulla
        </Link>
        <button type="submit" className="btn btn-primary mt-9 px-14">
          Continua
        </button>
      </div>
    </div>
  </FormSection>
);

export default ProfileData;
