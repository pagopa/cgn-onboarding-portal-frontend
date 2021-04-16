import React from "react";
import FormikStepper from "../../FormikStepper/FormikStepper";
import FormikStep from "../../FormikStepper/FormikStep";
import ProfileData from "./ProfileData";
import ReferentData from "./ReferentData";
import ProfileDescription from "./ProfileDescription";

type CreateProfileForm = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephoneNumber: string;
};

const CreateProfileForm = () => (
  <FormikStepper
    initialValues={{
      fullName: "PagoPA S.p.A.",
      hasDifferentName: false,
      name: "",
      pecAddress: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      telephoneNumber: "",
      taxCodeOrVat: "15376371009",
      description: "",
      salesChannel: "",
      addresses: [{ street: "", zipCode: "", city: "", district: "" }]
    }}
    onSubmit={async (values: any) => {
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
