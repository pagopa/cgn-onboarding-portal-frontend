import React from "react";
import { Field } from "formik";
import FormSection from "../../FormSection";
import FieldError from "../../FieldError";

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
    <FieldError errors={errors.description} touched={touched.description} />
  </FormSection>
);

export default ProfileDescription;
