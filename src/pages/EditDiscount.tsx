import React from "react";
import { useSelector } from "react-redux";
import CreateLayout from "../components/Layout/CreateLayout";
import EditDiscountForm from "../components/Form/EditDiscountForm/EditDiscountForm";
import { RootState } from "../store/store";
import { EntityType } from "../api/generated";

const EditDiscount = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const entityType = agreement?.entityType;
  return (
    <CreateLayout
      breadcrumbLabel="Modifica dati"
      title={(() => {
        switch (entityType) {
          case EntityType.Private:
            return "Dati agevolazione";
          case EntityType.PublicAdministration:
            return "Dati opportunità";
          default:
            return "Dati opportunità";
        }
      })()}
    >
      <EditDiscountForm />
    </CreateLayout>
  );
};

export default EditDiscount;
