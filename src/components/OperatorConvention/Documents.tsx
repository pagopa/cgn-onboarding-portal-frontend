import { format } from "date-fns";
import type { Document } from "../../api/generated_backoffice";
import DocumentIcon from "../../assets/icons/document.svg?react";

const Document = ({ doc }: { doc: Document }) => {
  const label =
    doc.documentType === "Agreement"
      ? "Convenzione"
      : "Domanda di adesione alla CGN";
  return (
    <div className="mb-5">
      <div className="mb-3 text-gray">{label}</div>
      <div className="d-flex flex-row align-items-center">
        <DocumentIcon className="me-4" />
        <div>
          <div>
            <a href={doc.documentUrl} target="_blank" rel="noreferrer">
              {label.replace(" ", "_")}.pdf
            </a>
          </div>
          <span className="text-muted" style={{ fontSize: "14px" }}>
            {format(new Date(doc.creationDate), "dd/MM/yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
};

const Documents = ({ documents }: { documents: Array<Document> }) => (
  <div>
    <h5 className="mb-7 fw-bold">Documenti</h5>
    {documents.map((doc, i) => (
      <Document key={i} doc={doc} />
    ))}
  </div>
);

export default Documents;
