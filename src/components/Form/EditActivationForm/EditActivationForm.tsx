import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Severity, useTooltip } from "../../../context/tooltip";
import Api from "../../../api/backoffice";
import chainAxios from "../../../utils/chainAxios";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import { OrganizationWithReferents } from "../../../api/generated_backoffice";
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

  const createActivation = async (organization: OrganizationWithReferents) =>
    await tryCatch(
      () => Api.Activations.upsertOrganization(organization),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        () => {
          setSubmitting(false);
          throwErrorTooltip(
            "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
          );
        },
        () => {
          setSubmitting(false);
          history.push(ADMIN_PANEL_ACCESSI);
        }
      )
      .run();

  const getActivation = async () =>
    await tryCatch(
      () => Api.Activations.getOrganization(operatorFiscalCode),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        () => {
          setLoading(false);
          throwErrorTooltip(
            "Errore durante la richiesta di dettaglio dell'operatore, riprovare"
          );
        },
        (data: OrganizationWithReferents) => {
          setLoading(false);
          setInitialValues(data);
        }
      )
      .run();

  useEffect(() => {
    setLoading(true);
    void getActivation();
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <ActivationForm
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
