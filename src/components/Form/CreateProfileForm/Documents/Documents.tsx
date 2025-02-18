import React, { useEffect, useMemo } from "react";
import { Button } from "design-react-kit";
import { useSelector } from "react-redux";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import { remoteData } from "../../../../api/common";
import { RootState } from "../../../../store/store";
import { Documents, EntityType } from "../../../../api/generated";
import { useTooltip, Severity } from "../../../../context/tooltip";
import FileRow from "./FileRow";

type Props = {
  setShowRequireApproval: (b: boolean) => void;
  handleBack: () => void;
  isCompleted: boolean;
};

const Documents = ({
  setShowRequireApproval,
  handleBack,
  isCompleted
}: Props) => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const documentsQuery = remoteData.Index.Document.getDocuments.useQuery({
    agreementId: agreement.id
  });
  const documents = useMemo(() => documentsQuery.data?.items ?? [], [
    documentsQuery.data?.items
  ]);
  const getFiles = () => documentsQuery.refetch();

  const requireApprovalMutation = remoteData.Index.Agreement.requestApproval.useMutation(
    {
      onSuccess() {
        setShowRequireApproval(true);
      },
      onError() {
        triggerTooltip({
          severity: Severity.DANGER,
          text:
            "Errore durante l'invio della richiesta di approvazione, riprovare in seguito"
        });
      }
    }
  );
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

  if (documentsQuery.isLoading) {
    return <CenteredLoading />;
  }

  return (
    <FormContainer className="mb-20">
      <div className="bg-white px-28 py-16">
        <p className="text-base font-weight-normal text-black">
          Per terminare la richiesta di convenzione scarica e firma digitalmente
          i documenti, poi ricaricali sul portale.
          <br /> I documenti sono precompilati con i dati che hai inserito
          finora, se vuoi effettuare delle modifiche, torna indietro nella
          compilazione prima di procedere.
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
          <p className="mt-8 text-gray">
            Invia la tua candidatura per approvazione. <br />
            Invieremo un messaggio all’indirizzo e-mail del referente con
            l’esito.
          </p>
        )}
        <div className="mt-10">
          <Button
            className="px-14 mr-4"
            color="primary"
            outline
            tag="button"
            onClick={handleBack}
          >
            Indietro
          </Button>
          {(isCompleted || allUploaded) && (
            <Button
              className="px-14"
              color="primary"
              tag="button"
              onClick={requireApproval}
            >
              Richiedi approvazione
            </Button>
          )}
        </div>
      </div>
    </FormContainer>
  );
};

export default Documents;
