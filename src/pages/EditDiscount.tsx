import React from "react";
import { useSelector } from "react-redux";
import CreateLayout from "../components/Layout/CreateLayout";
import EditDiscountForm from "../components/Form/EditDiscountForm/EditDiscountForm";
import { RootState } from "../store/store";
import { EntityType } from "../api/generated";

const EditDiscount = () => {
  const entityType = useSelector(
    (state: RootState) => state.agreement.value.entityType
  );
  return (
    <CreateLayout breadcrumbLabel="Modifica dati" title="Dati opportunità">
      <EditDiscountForm />
    </CreateLayout>
  );
};

export default EditDiscount;
