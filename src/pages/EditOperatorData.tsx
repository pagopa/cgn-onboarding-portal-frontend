import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import { EditOperatorDataForm } from "../components/Form/EditOperatorDataForm/EditOperatorDataForm";

const EditOperatorData = () => (
  <CreateLayout breadcrumbLabel="Modifica dati" title="Dati operatore">
    <EditOperatorDataForm />
  </CreateLayout>
);

export default EditOperatorData;
