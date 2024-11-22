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
import { simplifyAxios } from "../../../utils/simplifyAxios";

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

  const createActivation = async (organization: OrganizationWithReferents) => {
    setSubmitting(true);
    const response = await simplifyAxios(
      Api.AttributeAuthority.upsertOrganization(organization)
    );
    setSubmitting(false);
    if (response.status === 200) {
      history.push(ADMIN_PANEL_ACCESSI);
    } else if (
      response.status === 400 &&
      response.data === "CANNOT_BIND_MORE_THAN_TEN_ORGANIZATIONS"
    ) {
      throwErrorTooltip(
        "Gli utenti indicati possono gestire un numero massimo di 10 operatori. Controlla e riprova."
      );
    } else {
      throwErrorTooltip(
        "Errore durante la modifica dell'operatore, controllare i dati e riprovare"
      );
    }
  };

  const getActivation = async () =>
    await tryCatch(
      () => Api.AttributeAuthority.getOrganization(operatorFiscalCode),
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
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={createActivation}
      isSubmitting={submitting}
      canChangeEntityType={false}
    />
  );
};

export default CreateActivationForm;
