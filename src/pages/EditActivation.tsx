import { href } from "react-router";
import CreateEditActivationForm from "../components/Form/CreateEditActivationForm";
import CreateLayout from "../components/Layout/CreateLayout";

const EditActivation = ({ fiscalCode }: { fiscalCode: string }) => (
  <CreateLayout
    breadcrumbLink={href("/admin/accesses")}
    breadcrumbLabel="Modifica operatore"
    title="Modifica i dati"
  >
    <CreateEditActivationForm operatorFiscalCode={fiscalCode} />
  </CreateLayout>
);

export default EditActivation;
