import React, { useState, useEffect } from "react";
import { Button } from "design-react-kit";
import { useSelector } from "react-redux";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import Api from "../../../../api";
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
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Documents>({ items: [] });
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getFiles = async () =>
    await tryCatch(() => Api.Document.getDocuments(agreement.id), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        response => {
          setDocuments(response);
          setLoading(false);
        }
      )
      .run();

  const requireApproval = () => {
    void Api.Agreement.requestApproval(agreement.id)
      .then(() => setShowRequireApproval(true))
      .catch(() =>
        triggerTooltip({
          severity: Severity.DANGER,
          text:
            "Errore durante l'invio della richiesta di approvazione, riprovare in seguito"
        })
      );
  };

  const getUploadedDoc = (type: string) =>
    documents.items.find(d => d.documentType === type);

  const entityType = agreement.entityType;

  const allUploaded = (() => {
    switch (entityType) {
      case EntityType.Private:
        return documents.items.length === 2;
      case EntityType.PublicAdministration:
        return documents.items.length === 1;
    }
  })();

  useEffect(() => {
    void getFiles();
  }, []);

  if (loading) {
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
