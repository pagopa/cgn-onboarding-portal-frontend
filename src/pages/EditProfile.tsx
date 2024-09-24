import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import { EditProfileForm } from "../components/Form/EditOperatorDataForm/EditOperatorDataForm";

const EditProfile = () => (
  <CreateLayout breadcrumbLabel="Modifica dati" title="Profilo">
    <EditProfileForm />
  </CreateLayout>
);

export default EditProfile;
