import React from "react";
import { Field } from "formik";
import FormSection from "../../FormSection";
import CustomErrorMessage from "../../CustomErrorMessage";

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
    <CustomErrorMessage name="description" />
  </FormSection>
);

export default ProfileDescription;
