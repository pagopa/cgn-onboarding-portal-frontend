import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import { EditOperatorForm } from "../components/Form/EditOperatorDataForm/EditOperatorDataForm";

const EditProfile = () => (
  <CreateLayout breadcrumbLabel="Modifica dati" title="Profilo">
    <EditOperatorForm variant="edit-profile" />
  </CreateLayout>
);

export default EditProfile;
