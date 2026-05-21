import { useNavigate, useParams } from "react-router-dom";
import z from "zod/v4";
import { useMemo } from "react";
import { useFieldArray } from "@hookform/lenses/rhf";
import { Button, Box, Typography } from "@mui/material";
import { Severity, useTooltip } from "../../context/tooltip";
import { remoteData } from "../../api/common";
import { ADMIN_PANEL_ACCESSI } from "../../navigation/routes";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import { Field, FormErrorMessage } from "../../utils/react-hook-form-helpers";
import { useStandardForm } from "../../utils/useStandardForm";
import {
  EntityType,
  OrganizationWithReferents
} from "../../api/generated_backoffice";
import PlusCircleIcon from "../../assets/icons/plus-circle.svg?react";
import AsyncButton from "../AsyncButton/AsyncButton";
import { activationValidationSchema } from "./ValidationSchemas";
import FormSection from "./FormSection";
import FormField from "./FormField";

type ActivationFormInputValues = z.input<typeof activationValidationSchema>;

const emptyInitialValues: ActivationFormInputValues = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  insertedAt: "",
  pec: "",
  referents: [{ fiscalCode: "" }],
  entityType: undefined
};

function dataToFormValues(
  data: OrganizationWithReferents
): ActivationFormInputValues {
  return {
    entityType: data.entityType,
    organizationFiscalCode: data.organizationFiscalCode,
    organizationName: data.organizationName,
    pec: data.pec,
    referents: data.referents.map(fiscalCode => ({ fiscalCode })),
    keyOrganizationFiscalCode: data.keyOrganizationFiscalCode
  };
}

const CreateEditActivationForm = () => {
  const { operatorFiscalCode } = useParams<{ operatorFiscalCode: string }>();
  const navigate = useNavigate();
  const { triggerTooltip } = useTooltip();

  const upsertActivationMutation =
    remoteData.Backoffice.AttributeAuthority.upsertOrganization.useMutation({
      onSuccess() {
        navigate(ADMIN_PANEL_ACCESSI);
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
    remoteData.Backoffice.AttributeAuthority.getOrganization.useQuery(
      {
        keyOrganizationFiscalCode: operatorFiscalCode!
      },
      {
        enabled: Boolean(operatorFiscalCode)
      }
    );

  const initialValues = useMemo(
    () =>
      organizationQuery.data
        ? dataToFormValues(organizationQuery.data)
        : emptyInitialValues,
    [organizationQuery.data]
  );

  const form = useStandardForm({
    values: initialValues,
    zodSchema: activationValidationSchema
  });
  const referentsArray = useFieldArray(form.lens.focus("referents").interop());

  if (operatorFiscalCode && organizationQuery.isPending) {
    return <CenteredLoading />;
  }

  const canChangeEntityType = !operatorFiscalCode;

  const isMutating =
    form.formState.isSubmitting || upsertActivationMutation.isPending;

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(async values => {
        upsertActivationMutation.mutate({
          body: {
            ...values,
            keyOrganizationFiscalCode:
              operatorFiscalCode ?? values.organizationFiscalCode!
          }
        });
      })}
    >
      <FormSection
        title={"Dati operatore"}
        description={
          "Tutti i campi sono obbligatori. Questi dati non sono visibili in app IO."
        }
        isVisible={false}
      >
        <FormField
          htmlFor="organizationName"
          title="Denominazione e ragione sociale Operatore"
          description={"Inserire il nome completo dell'operatore"}
          required
        >
          <Field
            id="organizationName"
            formLens={form.lens.focus("organizationName")}
            type="text"
          />
          <FormErrorMessage formLens={form.lens.focus("organizationName")} />
        </FormField>
        <FormField
          htmlFor="entityType"
          title="Tipologia di ente"
          required
          description="La scelta non potrà essere modificata in seguito"
        >
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Field
              id="entityTypePrivato"
              formLens={form.lens.focus("entityType")}
              type="radio"
              value={EntityType.Private}
              readOnly={!canChangeEntityType}
              disabled={!canChangeEntityType}
            />
            <label
              htmlFor="entityTypePrivato"
              style={{ marginLeft: 8, fontSize: "0.875rem" }}
            >
              Privato
            </label>
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Field
              id="entityTypePubblico"
              formLens={form.lens.focus("entityType")}
              type="radio"
              value={EntityType.PublicAdministration}
              readOnly={!canChangeEntityType}
              disabled={!canChangeEntityType}
            />
            <label
              htmlFor="entityTypePubblico"
              style={{ marginLeft: 8, fontSize: "0.875rem" }}
            >
              Pubblico
            </label>
          </Box>
          <FormErrorMessage formLens={form.lens.focus("entityType")} />
        </FormField>
        <FormField
          htmlFor="organizationFiscalCode"
          title="Partita IVA"
          required
          // NICE_TO_HAVE: aggiungere validazione della partita iva (può essere nazionale o estera, non può essere codice fiscale)
          // tracked in https://pagopa.atlassian.net/browse/IOBP-1917
        >
          <Field
            id="organizationFiscalCode"
            formLens={form.lens.focus("organizationFiscalCode")}
            type="text"
          />
          <FormErrorMessage
            formLens={form.lens.focus("organizationFiscalCode")}
          />
        </FormField>
        <FormField htmlFor="pec" title="Indirizzo PEC" required>
          <Field id="pec" formLens={form.lens.focus("pec")} type="text" />
          <FormErrorMessage formLens={form.lens.focus("pec")} />
        </FormField>
      </FormSection>
      <FormSection
        title={"Utenti abilitati"}
        description={
          "Indicare il codice fiscale della persona o delle persone che devono accedere al portale per conto dell’operatore"
        }
        isVisible={false}
      >
        {form.lens
          .focus("referents")
          .map(referentsArray.fields, (_, itemLens, i) => (
            <div key={i}>
              <FormField
                htmlFor={`referents[${i}]`}
                title={`Codice fiscale utente ${i + 1}`}
                required
              >
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                  <Box sx={{ flexGrow: 1, maxWidth: "83.33%" }}>
                    <Field
                      id={`referents[${i}]`}
                      formLens={itemLens.focus("fiscalCode")}
                      type="text"
                    />
                  </Box>
                  {i !== 0 && (
                    <Button
                      sx={{ mr: 2 }}
                      color="primary"
                      variant="text"
                      type="button"
                      onClick={() => referentsArray.remove(i)}
                    ></Button>
                  )}
                </Box>
                <FormErrorMessage formLens={itemLens.focus("fiscalCode")} />
              </FormField>
            </div>
          ))}
        <Box
          sx={{
            mt: 4,
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
          onClick={() => referentsArray.append({ fiscalCode: "" })}
        >
          <PlusCircleIcon style={{ marginRight: 8 }} />
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: "#0073E6" }}
          >
            Aggiungi
          </Typography>
        </Box>
        <Box sx={{ display: "flex", mt: 5, gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            sx={{ fontSize: "inherit", px: 7 }}
            type="button"
            onClick={() => navigate(ADMIN_PANEL_ACCESSI)}
          >
            Indietro
          </Button>
          <AsyncButton
            type="submit"
            sx={{ fontSize: "inherit", px: 7 }}
            loading={isMutating}
          >
            Salva
          </AsyncButton>
        </Box>
      </FormSection>
    </form>
  );
};

export default CreateEditActivationForm;
