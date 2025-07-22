import { useHistory, useParams } from "react-router-dom";
import { Severity, useTooltip } from "../../context/tooltip";
import { remoteData } from "../../api/common";
import { ADMIN_PANEL_ACCESSI } from "../../navigation/routes";
import { OrganizationWithReferents } from "../../api/generated_backoffice";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import ActivationForm from "./ActivationForm";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  insertedAt: "",
  pec: "",
  referents: [""],
  entityType: undefined
};

const CreateEditActivationForm = () => {
  const { operatorFiscalCode } = useParams<{ operatorFiscalCode: string }>();
  const history = useHistory();
  const { triggerTooltip } = useTooltip();

  const upsertActivationMutation =
    remoteData.Backoffice.AttributeAuthority.upsertOrganization.useMutation({
      onSuccess() {
        history.push(ADMIN_PANEL_ACCESSI);
      },
      async onError(error) {
        if (
          error.status === 400 &&
          error.response?.data === "CANNOT_BIND_MORE_THAN_TEN_ORGANIZATIONS"
        ) {
          triggerTooltip({
            severity: Severity.DANGER,
            text: "Uno o più utenti abilitati gestiscono già 10 operatori e non possono gestirne altri. Controlla e riprova."
          });
        } else {
          triggerTooltip({
            severity: Severity.DANGER,
            text: operatorFiscalCode
              ? "Errore durante la modifica dell'operatore, controllare i dati e riprovare"
              : "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
          });
        }
      }
    });

  const organizationQuery =
    remoteData.Backoffice.AttributeAuthority.getOrganization.useQuery({
      keyOrganizationFiscalCode: operatorFiscalCode
    });

  const initialValues = organizationQuery.data ?? emptyInitialValues;

  if (organizationQuery.isPending) {
    return <CenteredLoading />;
  }

  return (
    <ActivationForm
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={values => {
        if (operatorFiscalCode) {
          upsertActivationMutation.mutate({ body: values });
        } else {
          upsertActivationMutation.mutate({
            body: {
              ...values,
              keyOrganizationFiscalCode: values.organizationFiscalCode
            }
          });
        }
      }}
      isSubmitting={upsertActivationMutation.isPending}
      canChangeEntityType={true}
    />
  );
};

export default CreateEditActivationForm;
