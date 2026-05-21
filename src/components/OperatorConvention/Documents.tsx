import { format } from "date-fns";
import type { Document } from "../../api/generated_backoffice";
import DocumentIcon from "../../assets/icons/document.svg?react";

const Document = ({ doc }: { doc: Document }) => {
  const label =
    doc.documentType === "Agreement"
      ? "Convenzione"
      : "Domanda di adesione alla CGN";
  return (
    <div>
      <div>{label}</div>
      <div>
        <DocumentIcon />
        <div>
          <div>
            <a href={doc.documentUrl} target="_blank" rel="noreferrer">
              {label.replace(" ", "_")}.pdf
            </a>
          </div>
          <span style={{ fontSize: "14px" }}>
            {format(new Date(doc.creationDate), "dd/MM/yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
};

const Documents = ({ documents }: { documents: Array<Document> }) => (
  <div>
    <h5>Documenti</h5>
    {documents.map((doc, i) => (
      <Document key={i} doc={doc} />
    ))}
  </div>
);

export default Documents;
