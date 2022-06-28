import { Button, Icon, Progress } from "design-react-kit";
import { saveAs } from "file-saver";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useRef, useState } from "react";
import Api from "../../../../api";
import { Document } from "../../../../api/generated";
import DocumentSuccess from "../../../../assets/icons/document-success.svg";
import DocumentIcon from "../../../../assets/icons/document.svg";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { formatDate } from "../../../../utils/dates";
import DeleteDocument from "./DeleteDocument";

type Props = {
  type: string;
  label: string;
  uploadedDoc?: Document;
  getFiles: () => void;
  agreementId: string;
};

const FileRow = ({
  type,
  label,
  uploadedDoc,
  getFiles,
  agreementId
}: Props) => {
  const refFile = useRef<any>();
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { triggerTooltip } = useTooltip();

  const handleClick = () => {
    refFile.current.click();
  };

  const getTemplates = () => {
    setLoadingTemplate(true);
    void pipe(
      TE.tryCatch(
        () =>
          Api.DocumentTemplate.downloadDocumentTemplate(agreementId, type, {
            headers: {
              "Content-Type": "application/pdf"
            },
            responseType: "arraybuffer",
            onDownloadProgress: (event: any) => {
              setUploadProgress(Math.round((100 * event.loaded) / event.total));
            }
          }),
        toError
      ),
      TE.map(response => response.data),
      TE.mapLeft(() => {
        setLoadingTemplate(false);
        setUploadProgress(0);
      }),
      TE.map(response => {
        if (response) {
          const blob = new Blob([response], { type: "application/pdf" });
          saveAs(blob, label);
        }
        setLoadingTemplate(false);
        setUploadProgress(0);
      })
    )();
  };

  const addFile = (files: any) => {
    setLoadingDoc(true);
    void pipe(
      TE.tryCatch(
        () =>
          Api.Document.uploadDocument(agreementId, type, files[0], {
            onUploadProgress: (event: any) => {
              setUploadProgress(Math.round((100 * event.loaded) / event.total));
            }
          }),
        toError
      ),
      TE.mapLeft(() => {
        setLoadingDoc(false);
        setUploadProgress(0);
      }),
      TE.map(response => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        response.status
          ? getFiles()
          : triggerTooltip({
              severity: Severity.DANGER,
              text: "Caricamento del file fallito"
            });
        setLoadingDoc(false);
        setUploadProgress(0);
      })
    )();
  };

  const deleteFile = () =>
    pipe(
      TE.tryCatch(
        () => Api.Document.deleteDocument(agreementId, type),
        toError
      ),
      TE.map(() => getFiles())
    )();

  return (
    <div className="border-bottom py-8">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row align-items-center">
          {!uploadedDoc ? (
            <DocumentIcon className="mr-4" />
          ) : (
            <DocumentSuccess className="mr-4" />
          )}
          {uploadedDoc ? (
            <div className="d-flex flex-column ">
              <a href={uploadedDoc.documentUrl}>{label}</a>
              <span className="text-gray">
                {formatDate(uploadedDoc.documentTimestamp)}
              </span>
            </div>
          ) : (
            <div>{label}</div>
          )}
        </div>
        {!loadingTemplate && !loadingDoc && (
          <>
            <div className="d-flex flex-row">
              {!uploadedDoc && (
                <>
                  <Button
                    color="primary"
                    icon
                    size="sm"
                    tag="button"
                    className="mr-2"
                    onClick={getTemplates}
                  >
                    <Icon
                      color="white"
                      icon="it-download"
                      padding={false}
                      size="xs"
                    />
                    Scarica
                  </Button>
                  <Button
                    color="primary"
                    icon
                    size="sm"
                    tag="button"
                    onClick={handleClick}
                  >
                    <Icon
                      color="white"
                      icon="it-upload"
                      padding={false}
                      size="xs"
                      className="mr-2"
                    />
                    Carica
                    <input
                      type="file"
                      hidden
                      ref={refFile}
                      onChange={() => addFile(refFile.current.files)}
                    />
                  </Button>
                </>
              )}
            </div>
            {uploadedDoc && <DeleteDocument onDelete={deleteFile} />}
          </>
        )}
      </div>
      {(loadingTemplate || loadingDoc) && (
        <div className="pt-3">
          <Progress
            value={uploadProgress}
            label="progresso"
            role="progressbar"
            tag="div"
          />
        </div>
      )}
    </div>
  );
};

export default FileRow;
