import CreateLayout from "../components/Layout/CreateLayout";
import { ADMIN_PANEL_ACCESSI } from "../navigation/routes";
import EditActivationForm from "../components/Form/EditActivationForm/EditActivationForm";

const EditActivation = () => (
  <CreateLayout
    breadcrumbLink={ADMIN_PANEL_ACCESSI}
    breadcrumbLabel="Modifica operatore"
    title="Modifica i dati"
  >
    <EditActivationForm />
  </CreateLayout>
);

export default EditActivation;
