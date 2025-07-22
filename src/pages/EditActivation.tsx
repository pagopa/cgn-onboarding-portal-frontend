import CreateEditActivationForm from "../components/Form/CreateEditActivationForm";
import CreateLayout from "../components/Layout/CreateLayout";
import { ADMIN_PANEL_ACCESSI } from "../navigation/routes";

const EditActivation = () => (
  <CreateLayout
    breadcrumbLink={ADMIN_PANEL_ACCESSI}
    breadcrumbLabel="Modifica operatore"
    title="Modifica i dati"
  >
    <CreateEditActivationForm />
  </CreateLayout>
);

export default EditActivation;
