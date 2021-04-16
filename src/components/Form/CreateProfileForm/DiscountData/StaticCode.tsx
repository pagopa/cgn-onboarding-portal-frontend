import React from "react";
import { Field } from "formik";
import { Button } from "design-react-kit";
import FormSection from "../../FormSection";
import InputField from "../../InputField";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import FieldError from "../../FieldError";

type Props = {
  errors: any;
  touched: any;
  children: any;
};

const StaticCode = ({ errors, touched, children }: any) => (
  <FormSection
    title="Codice statico"
    description="Inserire il codice relativo all’agevolazione che l’utente dovrà inserire sul vostro portale online*"
    isVisible
  >
    <InputField htmlFor="staticCode">
      <Field id="staticCode" name="staticCode" type="text" />
    </InputField>
    <FieldError errors={errors.staticCode} touched={errors.touched} />
    {children}
  </FormSection>
);

/*
<div className="mt-10">
      <PlusCircleIcon className="mr-2" />
      <span className="text-base font-weight-semibold text-blue">
        Aggiungi un&apos;altra agevolazione
      </span>
    </div>
*/

export default StaticCode;
