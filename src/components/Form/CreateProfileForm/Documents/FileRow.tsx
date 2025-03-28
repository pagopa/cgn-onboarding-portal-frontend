import React, { useRef, useState } from "react";
import { Button, Icon, Progress } from "design-react-kit";
import { saveAs } from "file-saver";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { AxiosProgressEvent } from "axios";
import { Severity, useTooltip } from "../../../../context/tooltip";
import DocumentIcon from "../../../../assets/icons/document.svg";
import Api from "../../../../api";
import DocumentSuccess from "../../../../assets/icons/document-success.svg";
import { Document } from "../../../../api/generated";
import { formatDate } from "../../../../utils/dates";
import { normalizeAxiosResponse } from "../../../../utils/normalizeAxiosResponse";
import { remoteData } from "../../../../api/common";
import DeleteDocument from "./DeleteDocument";

type Props = {
  type: string;
  label: string;
  uploadedDoc?: Document;
  getFiles: () => void;
  agreementId: string;
};

const FileRow = (
  { type, label, uploadedDoc, getFiles, agreementId }: Props // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const refFile = useRef<HTMLInputElement>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { triggerTooltip } = useTooltip();

  const handleClick = () => {
    refFile.current?.click();
  };

  const onUploadProgress = (event: AxiosProgressEvent) => {
    setUploadProgress(
      Math.round((100 * event.loaded) / (event.total ?? Infinity))
    );
  };

  const getTemplates = async () => {
    setLoadingTemplate(true);
    await tryCatch(
      () =>
        Api.DocumentTemplate.downloadDocumentTemplate(
          {
            agreementId,
            documentType: type
          },
          {
            headers: {
              "Content-Type": "application/pdf"
            },
            responseType: "arraybuffer",
            onDownloadProgress: onUploadProgress
          }
        ),
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

  const addFile = async (files: FileList) => {
    setLoadingDoc(true);
    const response = await normalizeAxiosResponse(
      Api.Document.uploadDocument(
        {
          agreementId,
          documentType: type,
          document: files[0]
        },
        {
          onUploadProgress
        }
      )
    );
    if (response.status === 200) {
      getFiles();
    } else if (
      response.status === 400 &&
      response.data === "PDF_NAME_OR_EXTENSION_NOT_VALID"
    ) {
      triggerTooltip({
        severity: Severity.DANGER,
        text:
          "Il formato del documento non è valido. Carica un documento PDF e riprova."
      });
    } else {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Caricamento del file fallito"
      });
    }
    setLoadingDoc(false);
    setUploadProgress(0);
  };

  const deleteFileMutation = remoteData.Index.Document.deleteDocument.useMutation(
    {
      onSuccess() {
        getFiles();
      }
    }
  );
  const deleteFile = () => {
    deleteFileMutation.mutate({ agreementId, documentType: type });
  };

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
                      accept="application/pdf"
                      onChange={() => {
                        if (refFile.current?.files) {
                          void addFile(refFile.current.files);
                        }
                      }}
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
