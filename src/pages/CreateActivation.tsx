import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import CreateActivationForm from "../components/Form/CreateActivationForm/CreateActivationForm";

const CreateActivation = () => (
  <CreateLayout breadcrumbLabel="Aggiungi operatore" title="Inserisci i dati">
    <CreateActivationForm />
  </CreateLayout>
);

export default CreateActivation;
