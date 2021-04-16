import React from "react";
import { Field } from "formik";
import FormSection from "../../FormSection";
import InputField from "../../InputField";
import FieldError from "../../FieldError";

type Props = {
  errors: any;
  touched: any;
  children?: any;
};

const ReferentData = ({ errors, touched, children }: Props) => (
  <FormSection
    title="Dati e contatti del referente incaricato"
    description="Indicare il nome della persona responsabile del programma CGN per conto dell'Operatore"
  >
    <InputField htmlFor="firstName" title="Nome" required>
      <Field id="referent.firstName" name="referent.firstName" type="text" />
      {errors.referent && touched.referent && (
        <FieldError
          errors={errors.referent.firstName}
          touched={touched.referent.firstName}
        />
      )}
    </InputField>
    <InputField htmlFor="referent.lastName" title="Cognome" required>
      <Field id="referent.lastName" name="referent.lastName" type="text" />
      {errors.referent && touched.referent && (
        <FieldError
          errors={errors.referent.lastName}
          touched={touched.referent.lastName}
        />
      )}
    </InputField>
    <InputField
      htmlFor="referent.role"
      title="Ruolo all'interno dell'azienda"
      required
    >
      <Field id="referent.role" name="referent.role" type="text" />
      {errors.referent && touched.referent && (
        <FieldError
          errors={errors.referent.role}
          touched={touched.referent.role}
        />
      )}
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
      {errors.referent && touched.referent && (
        <FieldError
          errors={errors.referent.emailAddress}
          touched={touched.referent.emailAddress}
        />
      )}
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
      {errors.referent && touched.referent && (
        <FieldError
          errors={errors.referent.telephoneNumber}
          touched={touched.referent.telephoneNumber}
        />
      )}
    </InputField>
    {children}
  </FormSection>
);

export default ReferentData;
