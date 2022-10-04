import { Field } from "formik";
import React from "react";
import CustomErrorMessage from "../../CustomErrorMessage";
import FormSection from "../../FormSection";

const ProfileDescription = () => (
  <FormSection
    title="Descrizione dell'operatore"
    description="Inserire una descrizione che spieghi i beni o servizi trattati agli utenti dell'app IO. La descrizione è obbligatoria sia in Italiano che in Inglese - Max 300 caratteri"
    required
    isVisible
  >
    <div className="row">
      <div className="col-6">
        <p className="text-sm font-weight-normal text-black mb-0">
          Italiano 🇮🇹
        </p>
        <Field
          as="textarea"
          id="description"
          name="description"
          placeholder="Inserisci una descrizione"
          maxLength="300"
          rows="4"
        />
      </div>
      <div className="col-6">
        <p className="text-sm font-weight-normal text-black mb-0">Inglese 🇬🇧</p>
        <Field
          as="textarea"
          id="description_en"
          name="description_en"
          placeholder="Type in the description"
          maxLength="300"
          rows="4"
        />
      </div>
    </div>
    <CustomErrorMessage name="description" />
  </FormSection>
);

export default ProfileDescription;
