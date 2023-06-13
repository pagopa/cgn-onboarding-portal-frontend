import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import CreateActivationForm from "../components/Form/CreateActivationForm/CreateActivationForm";
import { ADMIN_PANEL_ACCESSI } from "../navigation/routes";

const CreateActivation = () => (
  <CreateLayout
    breadcrumbLink={ADMIN_PANEL_ACCESSI}
    breadcrumbLabel="Aggiungi operatore"
    title="Inserisci i dati"
  >
    <CreateActivationForm />
  </CreateLayout>
);

export default CreateActivation;
