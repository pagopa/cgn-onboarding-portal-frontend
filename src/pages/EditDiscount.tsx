import { CreateEditDiscountForm } from "../components/Form/CreateEditDiscountForm";
import CreateLayout from "../components/Layout/CreateLayout";

function EditDiscount({ discountId }: { discountId?: string }) {
  return (
    <CreateLayout breadcrumbLabel="Modifica dati" title="Dati opportunità">
      <CreateEditDiscountForm discountId={discountId} />
    </CreateLayout>
  );
}

export default EditDiscount;
