import { CreateEditDiscountForm } from "../components/Form/CreateEditDiscountForm";
import CreateLayout from "../components/Layout/CreateLayout";

function CreateDiscount() {
  return (
    <CreateLayout
      breadcrumbLabel="Aggiungi opportunità"
      title="Dati opportunità"
    >
      <CreateEditDiscountForm />
    </CreateLayout>
  );
}

export default CreateDiscount;
