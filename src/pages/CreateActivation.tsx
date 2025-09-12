import { href } from "react-router";
import CreateEditActivationForm from "../components/Form/CreateEditActivationForm";
import CreateLayout from "../components/Layout/CreateLayout";

const CreateActivation = () => (
  <CreateLayout
    breadcrumbLink={href("/admin/accesses")}
    breadcrumbLabel="Aggiungi operatore"
    title="Inserisci i dati"
  >
    <CreateEditActivationForm />
  </CreateLayout>
);

export default CreateActivation;
