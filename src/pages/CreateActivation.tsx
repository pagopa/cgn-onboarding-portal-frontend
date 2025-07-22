import CreateLayout from "../components/Layout/CreateLayout";
import CreateEditActivationForm from "../components/Form/CreateActivationForm/CreateActivationForm";
import { ADMIN_PANEL_ACCESSI } from "../navigation/routes";

const CreateActivation = () => (
  <CreateLayout
    breadcrumbLink={ADMIN_PANEL_ACCESSI}
    breadcrumbLabel="Aggiungi operatore"
    title="Inserisci i dati"
  >
    <CreateEditActivationForm />
  </CreateLayout>
);

export default CreateActivation;
