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

  /**
   * given a result of an ajax call, returns a promise that always resolves, see return type
   * this mimics Future<Either<Err, Res>> composition (like in functional languages) that is more practical and conserves error type
   */
  type StatusCodeOk = 200 | 201 | 204;
  type StatusCodeKo = 400 | 403 | 404 | 409 | 404 | 500;
  async function decodeAxiosA<Data>(
    axiosOutcome: Promise<AxiosResponse<Data, unknown>>
  ): Promise<
    | { status: StatusCodeOk; data: Data }
    | { status: StatusCodeKo; data: unknown }
    | unknown // stands for errors that has not a http response or other erros that might be returned by axios
  > {
    try {
      const outcome = await axiosOutcome;
      if (outcome instanceof AxiosError) {
        if (outcome.response) {
          return {
            status: outcome.response.status as StatusCodeKo,
            data: outcome.response.data
          };
        } else {
          return outcome;
        }
      } else {
        return {
          status: outcome.status as StatusCodeOk,
          data: outcome.data
        };
      }
    } catch (error) {
      return error;
    }
  }

  async function exampleUsageDecodeAxiosA(
    organization: OrganizationWithReferents
  ) {
    const response = await Api.AttributeAuthority.upsertOrganization(
      organization
    );
    if (response.status === 200) {
      // everything all right
    } else if (response.status === 201) {
      // everything all right, but show a different visual feedback
    } else if (
      response.status === 400 ||
      response.data === "BUSINESS_LOGIC_ERROR_CODE"
    ) {
      // show a tooltip
    } else {
      // show a generic error message
    }
  }

  /**
   * given a result of an ajax call, returns a promise that resolves if status code 2xx,
   * otherwise rejects with AxiosError that might contain a response with a status code.
   * this aligns more with javascript stile promises, we loses error type, must be enclosed with try/catch statement with rethrow
   * and the programmer must remember to check for http error codes in the AxiosError
   */
  async function decodeAxiosB<Data>(
    axiosOutcome: Promise<AxiosResponse<Data, unknown>>
  ): Promise<{ status: StatusCodeOk; data: Data }> {
    const outcome = await axiosOutcome;
    if (outcome instanceof AxiosError) {
      throw outcome;
    } else {
      return {
        status: outcome.status as StatusCodeOk,
        data: outcome.data
      };
    }
  }

  type AxiosResponseLike = {
    status: number;
    data: unknown;
  };
  class AxiosErrorLike extends Error {
    response?: AxiosResponseLike;
    constructor(response?: AxiosResponseLike) {
      super();
      this.response = response;
    }
  }

  async function exampleUsageDecodeAxiosB(
    organization: OrganizationWithReferents
  ) {
    try {
      const response = await Api.AttributeAuthority.upsertOrganization(
        organization
      );
      if (response.status === 200) {
        // everything all right
      } else if (response.status === 201) {
        // everything all right, but show a different visual feedback
      } else {
        throw new AxiosErrorLike(response);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // show a tooltip
      } else {
        // show a generic error message
      }
    }
  }

  const createActivation = async (organization: OrganizationWithReferents) => {
    try {
      const response = await Api.AttributeAuthority.upsertOrganization(
        organization
      );
      if (response instanceof AxiosError) {
        if (
          response.response?.status === 400 &&
          response.response?.data === "CANNOT_BIND_MORE_THAN_TEN_ORGANIZATIONS"
        ) {
          triggerTooltip({
            severity: Severity.WARNING,
            text:
              "Gli utenti indicati possono gestire un numero massimo di 10 operatori. Controlla e riprova."
          });
        } else {
          throw new Error();
        }
      } else {
        if (response.status === 200) {
          history.push(ADMIN_PANEL_ACCESSI);
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      triggerTooltip({
        severity: Severity.DANGER,
        text:
          "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
      });
    } finally {
      setLoading(false);
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
        setLoading(true);
        void createActivation(newValues);
      }}
      isSubmitting={loading}
      canChangeEntityType={true}
    />
  );
};

export default CreateActivationForm;
