import { useEffect, useMemo } from "react";
import { Box, Button } from "@mui/material";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import { remoteData } from "../../../../api/common";
import type { Documents } from "../../../../api/generated";
import { EntityType } from "../../../../api/generated";
import { useTooltip, Severity } from "../../../../context/tooltip";
import { createAgreement } from "../../../../store/agreement/agreementSlice";
import AsyncButton from "../../../AsyncButton/AsyncButton";
import { selectAgreement } from "../../../../store/agreement/selectors";
import { useCgnDispatch, useCgnSelector } from "../../../../store/hooks";
import FileRow from "./FileRow";

type Props = {
  handleBack: () => void;
  isCompleted: boolean;
};

const Documents = ({ handleBack, isCompleted }: Props) => {
  const agreement = useCgnSelector(selectAgreement);
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const documentsQuery = remoteData.Index.Document.getDocuments.useQuery({
    agreementId: agreement.id
  });
  const documents = useMemo(
    () => documentsQuery.data?.items ?? [],
    [documentsQuery.data?.items]
  );
  const getFiles = () => documentsQuery.refetch();

  const dispatch = useCgnDispatch();

  const requireApprovalMutation =
    remoteData.Index.Agreement.requestApproval.useMutation({
      onSuccess() {
        void dispatch(createAgreement());
      },
      onError() {
        triggerTooltip({
          severity: Severity.DANGER,
          text: "Errore durante l'invio della richiesta di approvazione, riprovare in seguito"
        });
      }
    });
  const requireApproval = () => {
    requireApprovalMutation.mutate({ agreementId: agreement.id });
  };

  const getUploadedDoc = (type: string) =>
    documents.find(d => d.documentType === type);

  const entityType = agreement.entityType;

  const allUploaded = (() => {
    switch (entityType) {
      case EntityType.Private:
        return documents.length === 2;
      case EntityType.PublicAdministration:
        return documents.length === 1;
    }
  })();

  if (documentsQuery.isPending) {
    return <CenteredLoading />;
  }

  const isMutating = requireApprovalMutation.isPending;

  return (
    <FormContainer>
      <Box sx={{ backgroundColor: "white", p: 4 }}>
        <p>
          Per inviare la richiesta di convenzione, scarica e firma digitalmente
          in{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/il-convenzionamento/firma-della-convenzione"
          >
            modalità PAdES
          </a>{" "}
          i documenti. Una volta fatto, carica i documenti firmati in{" "}
          <span>formato .pdf</span> sul portale. I documenti sono già compilati
          con i dati inseriti fino a questo momento. Se desideri apportare delle
          modifiche, puoi farlo prima di procedere, tornando alla fase di
          compilazione.
        </p>
        <FileRow
          getFiles={getFiles}
          uploadedDoc={getUploadedDoc("agreement")}
          type="agreement"
          label="Convenzione"
          agreementId={agreement.id}
        />
        {entityType === EntityType.Private && (
          <FileRow
            getFiles={getFiles}
            uploadedDoc={getUploadedDoc("adhesion_request")}
            type="adhesion_request"
            label="Domanda di adesione alla CGN"
            agreementId={agreement.id}
          />
        )}
        {(isCompleted || allUploaded) && (
          <p>
            Invia la tua candidatura per approvazione. <br />
            Invieremo un messaggio all’indirizzo e-mail del referente con
            l’esito.
          </p>
        )}
        <div>
          <Button
            sx={{ px: 7 }}
            color="primary"
            variant="outlined"
            type="button"
            onClick={handleBack}
          >
            Indietro
          </Button>
          {(isCompleted || allUploaded) && (
            <AsyncButton
              sx={{ px: 7 }}
              color="primary"
              onClick={requireApproval}
              loading={isMutating}
            >
              Richiedi approvazione
            </AsyncButton>
          )}
        </div>
      </Box>
    </FormContainer>
  );
};

export default Documents;
