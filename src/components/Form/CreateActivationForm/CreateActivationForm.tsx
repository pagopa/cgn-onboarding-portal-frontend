import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Severity, useTooltip } from "../../../context/tooltip";
import Api from "../../../api/backoffice";
import chainAxios from "../../../utils/chainAxios";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import { OrganizationWithReferents } from "../../../api/generated_backoffice";
import ActivationForm from "../ActivationForm";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  entityType: undefined,
  pec: "",
  referents: [""]
};

const CreateActivationForm = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = () => {
    triggerTooltip({
      severity: Severity.DANGER,
      text:
        "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
    });
  };

  const createActivation = async (organization: OrganizationWithReferents) =>
    await tryCatch(
      () => Api.AttributeAuthority.upsertOrganization(organization),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        () => {
          setLoading(false);
          throwErrorTooltip();
        },
        () => {
          setLoading(false);
          history.push(ADMIN_PANEL_ACCESSI);
        }
      )
      .run();

  return (
    <ActivationForm
      enableReinitialize={false}
      initialValues={emptyInitialValues}
      onSubmit={values => {
        const newValues: OrganizationWithReferents = {
          ...values,
          keyOrganizationFiscalCode: values.organizationFiscalCode
        };
        setLoading(true);
        void createActivation(newValues);
      }}
      isSubmitting={loading}
    />
  );
};

export default CreateActivationForm;
