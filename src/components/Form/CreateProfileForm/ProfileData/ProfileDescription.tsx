import React from "react";
import { Field, ErrorMessage } from "formik";
import FormSection from "../../FormSection";

type Props = {
  errors: any;
  touched: any;
  formValues: any;
};

const ProfileDescription = ({ errors, touched, formValues }: Props) => (
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
