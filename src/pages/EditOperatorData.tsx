import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import { EditOperatorForm } from "../components/Form/EditOperatorDataForm/EditOperatorDataForm";

const EditOperatorData = () => (
  <CreateLayout breadcrumbLabel="Modifica dati" title="Dati operatore">
    <EditOperatorForm variant="edit-data" />
  </CreateLayout>
);

export default EditOperatorData;
