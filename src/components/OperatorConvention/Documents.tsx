import React from "react";
import DocumentIcon from "../../assets/icons/document.svg";

const Document = ({ doc, i }: { doc: any; i: number }) => {
  const splittedUrl = doc.documentUrl.split("/");
  return (
    <div className="mb-5">
      <div className="mb-3 text-gray">
        {doc.documentType === "Agreement" ? "Convenzione" : `Allegato ${i + 1}`}
      </div>
      <div className="d-flex flex-row align-items-center">
        <DocumentIcon className="mr-4" />
        <div>
          <div>
            <a href={doc.documentUrl} target="_blank" rel="noreferrer">
              {splittedUrl[splittedUrl.length - 1]}
            </a>
          </div>
          <span className="text-muted" style={{ fontSize: "14px" }}>
            {doc.creationDate}
          </span>
        </div>
      </div>
    </div>
  );
};

const Documents = ({ documents }: { documents: any }) => {
  return (
    <div>
      <h5 className="mb-7 font-weight-bold">Documenti</h5>
      {documents.map((doc, i) => (
        <Document doc={doc} i={i} />
      ))}
    </div>
  );
};

export default Documents;
