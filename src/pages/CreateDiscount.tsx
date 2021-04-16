import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import CreateDiscountForm from "../components/Form/CreateDiscountForm/CreateDiscountForm";

const CreateDiscount = () => {
  return (
    <CreateLayout
      breadcrumbLabel="Aggiungi agevolazione"
      title="Dati agevolazione"
    >
      <CreateDiscountForm />
    </CreateLayout>
  );
};

export default CreateDiscount;
