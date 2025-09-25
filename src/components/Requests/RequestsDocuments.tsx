import { useEffect, useRef } from "react";
import { Button, Icon } from "design-react-kit";
import DocumentIcon from "../../assets/icons/document.svg?react";
import DocumentSuccess from "../../assets/icons/document-success.svg?react";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import { remoteData } from "../../api/common";
import {
  Agreement,
  Document,
  DocumentType
} from "../../api/generated_backoffice";

const CheckedDocument = ({
  doc,
  i,
  deleteDocument,
  assignedToMe,
  canBeDeleted
}: {
  doc: Document;
  i: number;
  deleteDocument: (type: DocumentType) => void;
  assignedToMe: boolean;
  canBeDeleted?: boolean;
}) => {
  const label =
    doc.documentType === "Agreement"
      ? "Convenzione"
      : "Domanda di adesione alla CGN";
  return (
    <div key={i} className="border-bottom py-5">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div>
          <div className="mb-3 text-gray">{label}</div>
          <div className="d-flex flex-row align-items-center">
            <DocumentSuccess className="me-4" />
            <a href={doc.documentUrl} target="_blank" rel="noreferrer">
              {label.replace(" ", "_")}.pdf
            </a>
          </div>
        </div>

        {assignedToMe && canBeDeleted && (
          <span
            className="d-flex flex-row align-items-center cursor-pointer"
            onClick={() => deleteDocument(doc.documentType)}
          >
            <Icon icon="it-delete" size="sm" color="danger" />
            <span className="text-sm text-danger">Elimina</span>
          </span>
        )}
      </div>
    </div>
  );
};

const UncheckedDocument = ({
  doc,
  i,
  original,
  uploadDocument,
  assignedToMe
}: {
  doc: Document;
  i: number;
  original: Agreement;
  uploadDocument: (type: DocumentType, file: File) => void;
  assignedToMe: boolean;
}) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const label =
    doc.documentType === "Agreement"
      ? "Convenzione"
      : "Domanda di adesione alla CGN";
  return (
    <div key={i} className="border-bottom py-5">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div>
          <div className="mb-3 text-gray">{label}</div>
          <div className="d-flex flex-row align-items-center">
            <DocumentIcon className="me-4" />
            <a href={doc.documentUrl} target="_blank" rel="noreferrer">
              {label.replace(" ", "_")}.pdf
            </a>
          </div>
        </div>
        {assignedToMe && (
          <Button
            color="primary"
            icon
            size="sm"
            tag="button"
            disabled={original.state === "PendingAgreement"}
            onClick={() => uploadInputRef.current?.click()}
          >
            <Icon
              color="white"
              icon="it-upload"
              padding={false}
              size="xs"
              className="me-2"
            />
            Carica controfirmato
          </Button>
        )}
        <input
          type="file"
          style={{ display: "none" }}
          ref={uploadInputRef}
          accept="application/pdf"
          onChange={e => {
            if (e.target.files?.length) {
              uploadDocument(doc.documentType, e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
};

const RequestDocuments = ({
  original,
  assignedToMe,
  setCheckAllDocs
}: {
  original: Agreement;
  assignedToMe: boolean;
  setCheckAllDocs: (state: boolean) => void;
}) => {
  const documentsQuery = remoteData.Backoffice.Document.getDocuments.useQuery({
    agreementId: original.id
  });
  const documents = documentsQuery.data;
  const isSignedDocumentUploaded =
    documents?.some(d => d.documentType === "Agreement") ?? false;
  useEffect(() => {
    setCheckAllDocs(isSignedDocumentUploaded);
  }, [isSignedDocumentUploaded, setCheckAllDocs]);

  const uploadDocumentMutation =
    remoteData.Backoffice.Document.uploadDocument.useMutation({
      onSuccess() {
        void documentsQuery.refetch();
      }
    });
  const uploadDocument = (documentType: DocumentType, file: File) => {
    uploadDocumentMutation.mutate({
      agreementId: original.id,
      documentType,
      document: file
    });
  };

  const deleteDocumentMutation =
    remoteData.Backoffice.Document.deleteDocument.useMutation({
      onSuccess() {
        void documentsQuery.refetch();
      }
    });
  const deleteDocument = (documentType: DocumentType) => {
    deleteDocumentMutation.mutate({
      agreementId: original.id,
      documentType
    });
  };

  const isPending =
    documentsQuery.isPending ||
    uploadDocumentMutation.isPending ||
    deleteDocumentMutation.isPending;

  return (
    <>
      <h1 className="h5 fw-bold text-dark-blue mb-5">Documenti</h1>
      {isPending ? (
        <CenteredLoading />
      ) : (
        original.documents?.map((doc, i) => {
          if (doc.documentType === "AdhesionRequest") {
            return (
              <CheckedDocument
                key={i}
                doc={doc}
                i={i}
                deleteDocument={deleteDocument}
                assignedToMe={assignedToMe}
              />
            );
          }
          const uploadedDoc = documents?.find(
            d => d.documentType === doc.documentType
          );
          if (uploadedDoc) {
            return (
              <CheckedDocument
                key={i}
                doc={doc}
                i={i}
                deleteDocument={deleteDocument}
                assignedToMe={assignedToMe}
                canBeDeleted
              />
            );
          } else {
            return (
              <UncheckedDocument
                key={i}
                doc={doc}
                i={i}
                original={original}
                uploadDocument={uploadDocument}
                assignedToMe={assignedToMe}
              />
            );
          }
        })
      )}
    </>
  );
};

export default RequestDocuments;
