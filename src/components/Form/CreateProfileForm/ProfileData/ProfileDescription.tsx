import React from "react";
import { Field, ErrorMessage } from "formik";
import FormSection from "../../FormSection";

const ProfileDescription = () => (
  <FormSection
    title="Descrizione dell'operatore"
    description="Inserire una descrizione che spieghi i beni o servizi trattati agli utenti dell'app - Max 300 caratteri"
    required
    isVisible
  >
    <Field
      as="textarea"
      id="description"
      name="description"
      placeholder="Inserisci una descrizione"
      maxLength="300"
      rows="4"
    />
    <ErrorMessage name="description" />
  </FormSection>
);

export default ProfileDescription;
