import React from "react";
import { Field } from "formik";
import { Link } from "react-router-dom";
import { ROOT } from "../../../navigation/routes";
import FormSection from "../FormSection";
import InputField from "../InputField";

interface IProps {
  firstName: string;
  lastName: string;
}

const ReferentData = ({ firstName, lastName }: IProps) => (
  <FormSection
    hasIntroduction
    title="Dati e contatti del referente incaricato"
    description="Indicare il nome della persona responsabile del programma CGN per conto dell'Operatore"
    isVisible={false}
  >
    <InputField htmlFor="firstName" title="Nome" required>
      <Field
        id="firstName"
        name="firstName"
        type="text"
        disabled
        value={firstName}
      />
    </InputField>
    <InputField htmlFor="lastName" title="Cognome" required>
      <Field
        id="lastName"
        name="lastName"
        type="text"
        disabled
        value={lastName}
      />
    </InputField>
    <InputField htmlFor="emailAddress" title="Indirizzo e-mail" required>
      <Field id="emailAddress" name="emailAddress" type="email" />
    </InputField>
    <InputField htmlFor="telephoneNumber" title="Numero di telefono" required>
      <Field
        id="telephoneNumber"
        name="telephoneNumber"
        type="tel"
        placeholder="Inserisci il numero di telefono"
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

export default ReferentData;
