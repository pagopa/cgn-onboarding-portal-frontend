import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import CreateDiscountForm from "../components/Form/CreateDiscountForm/CreateDiscountForm";

const CreateDiscount = () => (
  <CreateLayout breadcrumbLabel="Aggiungi opportunità" title="Dati opportunità">
    <CreateDiscountForm />
  </CreateLayout>
);

export default CreateDiscount;
