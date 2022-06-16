import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Api from "../../../api/backoffice";
import { OrganizationWithReferents } from "../../../api/generated_backoffice";
import { Severity, useTooltip } from "../../../context/tooltip";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import chainAxios from "../../../utils/chainAxios";
import ActivationForm from "../ActivationForm";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
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

  const createActivation = (organization: OrganizationWithReferents) =>
    pipe(
      TE.tryCatch(
        () => Api.AttributeAuthority.upsertOrganization(organization),
        toError
      ),
      TE.chain(chainAxios),
      TE.map(response => response.data),
      TE.mapLeft(() => {
        setLoading(false);
        throwErrorTooltip();
      }),
      TE.map(() => {
        setLoading(false);
        history.push(ADMIN_PANEL_ACCESSI);
      })
    )();

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
