import CreateLayout from "../components/Layout/CreateLayout";
import CreateDiscountForm from "../components/Form/CreateDiscountForm/CreateDiscountForm";

function CreateDiscount() {
  return (
    <CreateLayout
      breadcrumbLabel="Aggiungi opportunità"
      title="Dati opportunità"
    >
      <CreateDiscountForm />
    </CreateLayout>
  );
}

export default CreateDiscount;
