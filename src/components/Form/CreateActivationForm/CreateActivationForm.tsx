import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Severity, useTooltip } from "../../../context/tooltip";
import Api from "../../../api/backoffice";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import {
  EntityType,
  OrganizationWithReferents
} from "../../../api/generated_backoffice";
import ActivationForm from "../ActivationForm";
import { simplifyAxios } from "../../../utils/simplifyAxios";

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
  const [loading, setLoading] = useState(false);
  const { triggerTooltip } = useTooltip();

  const createActivation = async (organization: OrganizationWithReferents) => {
    setLoading(true);
    const response = await simplifyAxios(
      Api.AttributeAuthority.upsertOrganization(organization)
    );
    setLoading(false);
    if (response.status === 200) {
      history.push(ADMIN_PANEL_ACCESSI);
    } else if (
      response.status === 400 &&
      response.data === "CANNOT_BIND_MORE_THAN_TEN_ORGANIZATIONS"
    ) {
      triggerTooltip({
        severity: Severity.DANGER,
        text:
          "Gli utenti indicati possono gestire un numero massimo di 10 operatori. Controlla e riprova."
      });
    } else {
      triggerTooltip({
        severity: Severity.DANGER,
        text:
          "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
      });
    }
  };

  return (
    <ActivationForm
      enableReinitialize={false}
      initialValues={emptyInitialValues}
      onSubmit={values => {
        const newValues: OrganizationWithReferents = {
          ...values,
          keyOrganizationFiscalCode: values.organizationFiscalCode
        };
        void createActivation(newValues);
      }}
      isSubmitting={loading}
      canChangeEntityType={true}
    />
  );
};

export default CreateActivationForm;
