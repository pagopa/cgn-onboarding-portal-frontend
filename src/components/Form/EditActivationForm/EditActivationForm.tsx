import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Api from "../../../api/backoffice";
import { OrganizationWithReferents } from "../../../api/generated_backoffice";
import { Severity, useTooltip } from "../../../context/tooltip";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import chainAxios from "../../../utils/chainAxios";
import CenteredLoading from "../../CenteredLoading";
import ActivationForm from "../ActivationForm";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  insertedAt: "",
  pec: "",
  referents: [""]
};

const CreateActivationForm = () => {
  const { operatorFiscalCode } = useParams<{ operatorFiscalCode: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<OrganizationWithReferents>(
    emptyInitialValues
  );
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = (message: string) => {
    triggerTooltip({
      severity: Severity.DANGER,
      text: message
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
        setSubmitting(false);
        throwErrorTooltip(
          "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
        );
      }),
      TE.map(() => {
        setSubmitting(false);
        history.push(ADMIN_PANEL_ACCESSI);
      })
    )();

  const getActivation = () =>
    pipe(
      TE.tryCatch(
        () => Api.AttributeAuthority.getOrganization(operatorFiscalCode),
        toError
      ),
      TE.chain(chainAxios),
      TE.map(response => response.data),
      TE.mapLeft(() => {
        setLoading(false);
        throwErrorTooltip(
          "Errore durante la richiesta di dettaglio dell'operatore, riprovare"
        );
      }),
      TE.map((data: OrganizationWithReferents) => {
        setLoading(false);
        setInitialValues(data);
      })
    )();

  useEffect(() => {
    setLoading(true);
    void getActivation();
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <ActivationForm
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={values => {
        const newValues: OrganizationWithReferents = {
          ...values
        };
        setSubmitting(true);
        void createActivation(newValues);
      }}
      isSubmitting={submitting}
    />
  );
};

export default CreateActivationForm;
