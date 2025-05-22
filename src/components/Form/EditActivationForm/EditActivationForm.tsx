import { useHistory, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { Severity, useTooltip } from "../../../context/tooltip";
import { remoteData } from "../../../api/common";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import { OrganizationWithReferents } from "../../../api/generated_backoffice";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import ActivationForm from "../ActivationForm";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  insertedAt: "",
  pec: "",
  referents: [""],
  entityType: undefined
};

const CreateActivationForm = () => {
  const { operatorFiscalCode } = useParams<{ operatorFiscalCode: string }>();
  const history = useHistory();
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = useCallback(
    (message: string) => {
      triggerTooltip({
        severity: Severity.DANGER,
        text: message
      });
    },
    [triggerTooltip]
  );

  const createActivationMutation =
    remoteData.Backoffice.AttributeAuthority.upsertOrganization.useMutation({
      onSuccess() {
        history.push(ADMIN_PANEL_ACCESSI);
      },
      async onError(error) {
        if (
          error.status === 400 &&
          error.response?.data === "CANNOT_BIND_MORE_THAN_TEN_ORGANIZATIONS"
        ) {
          throwErrorTooltip(
            "Uno o più utenti abilitati gestiscono già 10 operatori e non possono gestirne altri. Controlla e riprova."
          );
        } else {
          throwErrorTooltip(
            "Errore durante la modifica dell'operatore, controllare i dati e riprovare"
          );
        }
      }
    });
  const createActivation = (organization: OrganizationWithReferents) => {
    createActivationMutation.mutate({ body: organization });
  };

  const { data, error, isLoading } =
    remoteData.Backoffice.AttributeAuthority.getOrganization.useQuery({
      keyOrganizationFiscalCode: operatorFiscalCode
    });
  useEffect(() => {
    if (error) {
      throwErrorTooltip(
        "Errore durante la richiesta di dettaglio dell'operatore, riprovare"
      );
    }
  }, [data, error, throwErrorTooltip]);

  const initialValues = data ?? emptyInitialValues;

  if (isLoading) {
    return <CenteredLoading />;
  }

  return (
    <ActivationForm
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={createActivation}
      isSubmitting={createActivationMutation.isLoading}
      canChangeEntityType={false}
    />
  );
};

export default CreateActivationForm;
