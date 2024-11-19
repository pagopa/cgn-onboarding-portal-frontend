import React from "react";
import { useSelector } from "react-redux";
import CreateLayout from "../components/Layout/CreateLayout";
import CreateDiscountForm from "../components/Form/CreateDiscountForm/CreateDiscountForm";
import { EntityType } from "../api/generated";
import { RootState } from "../store/store";

const CreateDiscount = () => {
  const entityType = useSelector(
    (state: RootState) => state.agreement.value.entityType
  );
  return (
    <CreateLayout
      breadcrumbLabel="Aggiungi opportunità"
      title="Dati opportunità"
    >
      <CreateDiscountForm />
    </CreateLayout>
  );
};

export default CreateDiscount;
