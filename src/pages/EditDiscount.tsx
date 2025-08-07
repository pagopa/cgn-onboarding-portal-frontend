import { CreateEditDiscountForm } from "../components/Form/CreateEditDiscountForm";
import CreateLayout from "../components/Layout/CreateLayout";

function EditDiscount() {
  return (
    <CreateLayout breadcrumbLabel="Modifica dati" title="Dati opportunità">
      <CreateEditDiscountForm />
    </CreateLayout>
  );
}

export default EditDiscount;
