import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import EditDiscountForm from "../components/Form/EditDiscountForm/EditDiscountForm";

const EditDiscount = () => (
    <CreateLayout breadcrumbLabel="Modifica dati" title="Dati agevolazione">
      <EditDiscountForm />
    </CreateLayout>
  );

export default EditDiscount;
