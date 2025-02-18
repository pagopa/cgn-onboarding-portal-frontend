import { useHistory } from "react-router-dom";
import React from "react";
import { Severity, useTooltip } from "../../../context/tooltip";
import { remoteData } from "../../../api/common";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import {
  EntityType,
  OrganizationWithReferents
} from "../../../api/generated_backoffice";
import ActivationForm from "../ActivationForm";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  entityType: EntityType.Private,
  pec: "",
  referents: [""]
};

const CreateActivationForm = () => {
  const history = useHistory();
  const { triggerTooltip } = useTooltip();

  const {
    mutate,
    isLoading
  } = remoteData.Backoffice.AttributeAuthority.upsertOrganization.useMutation({
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
          text:
            "Uno o più utenti abilitati gestiscono già 10 operatori e non possono gestirne altri. Controlla e riprova."
        });
      } else {
        triggerTooltip({
          severity: Severity.DANGER,
          text:
            "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
        });
      }
    }
  });

  return (
    <ActivationForm
      enableReinitialize={false}
      initialValues={emptyInitialValues}
      onSubmit={values => {
        mutate({
          body: {
            ...values,
            keyOrganizationFiscalCode: values.organizationFiscalCode
          }
        });
      }}
      isSubmitting={isLoading}
      canChangeEntityType={true}
    />
  );
};

export default CreateActivationForm;
