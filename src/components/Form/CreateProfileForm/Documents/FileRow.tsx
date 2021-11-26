import React, { useRef, useState } from "react";
import { Button, Icon, Progress } from "design-react-kit";
import { saveAs } from "file-saver";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Severity, useTooltip } from "../../../../context/tooltip";
import DocumentIcon from "../../../../assets/icons/document.svg";
import Api from "../../../../api";
import DocumentSuccess from "../../../../assets/icons/document-success.svg";
import { Document } from "../../../../api/generated";
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

  const getTemplates = async () => {
    setLoadingTemplate(true);
    await tryCatch(
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
    )
      .map(response => response.data)
      .fold(
        () => {
          setLoadingTemplate(false);
          setUploadProgress(0);
        },
        response => {
          if (response) {
            const blob = new Blob([response], { type: "application/pdf" });
            saveAs(blob, label);
          }
          setLoadingTemplate(false);
          setUploadProgress(0);
        }
      )
      .run();
  };

  const addFile = async (files: any) => {
    setLoadingDoc(true);
    await tryCatch(
      () =>
        Api.Document.uploadDocument(agreementId, type, files[0], {
          onUploadProgress: (event: any) => {
            setUploadProgress(Math.round((100 * event.loaded) / event.total));
          }
        }),
      toError
    )
      .fold(
        () => {
          setLoadingDoc(false);
          setUploadProgress(0);
        },
        response => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          response.status
            ? getFiles()
            : triggerTooltip({
                severity: Severity.DANGER,
                text: "Caricamento del file fallito"
              });
          setLoadingDoc(false);
          setUploadProgress(0);
        }
      )
      .run();
  };

  const deleteFile = async () =>
    await tryCatch(
      () => Api.Document.deleteDocument(agreementId, type),
      toError
    )
      .fold(
        () => void 0,
        () => getFiles()
      )
      .run();

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
