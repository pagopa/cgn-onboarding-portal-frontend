import React from "react";
import FormikStepper from "../../Base/FormikStepper/FormikStepper";
import FormikStep from "../../Base/FormikStepper/FormikStep";
import ProfileData from "./ProfileData";
import ReferentData from "./ReferentData";
import ProfileDescription from "./ProfileDescription";

const CreateProfileForm = () => (
  <FormikStepper
    initialValues={{
      fullName: "PagoPA S.p.A.",
      name: "",
      taxCodeOrVat: "15376371009",
      pecAddress: ""
    }}
    onSubmit={async values => {
      // eslint-disable-next-line no-console
      console.log("values", values);
    }}
  >
    <FormikStep label="Dati relativi all'operatore">
      <ProfileData />
    </FormikStep>
    <FormikStep label="Dati del referente">
      <ReferentData firstName="Mario" lastName="Rossi" />
    </FormikStep>
    <FormikStep label="Descrizione operatore">
      <ProfileDescription />
    </FormikStep>
  </FormikStepper>
);

export default CreateProfileForm;
