import CreateLayout from "../components/Layout/CreateLayout";
import EditDiscountForm from "../components/Form/EditDiscountForm/EditDiscountForm";

function EditDiscount() {
  return (
    <CreateLayout breadcrumbLabel="Modifica dati" title="Dati opportunità">
      <EditDiscountForm />
    </CreateLayout>
  );
}

export default EditDiscount;
