import React, { useRef, useState } from "react";
import { Button, Progress } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { constNull } from "fp-ts/lib/function";
import { useTooltip } from "../../../../context/tooltip";
import Api from "../../../../api";
import DocumentSuccess from "../../../../assets/icons/document-success.svg";
import { Document } from "../../../../api/generated";
import { formatDate } from "../../../../utils/dates";
import DeleteDocument from "../Documents/DeleteDocument";

type Props = {
  label: string;
  formValues: any;
  setFieldValue: any;
  agreementId: string;
  uploadedDoc?: Document;
  index?: number;
};

const Bucket = ({
  index,
  label,
  uploadedDoc,
  agreementId,
  setFieldValue
}: Props) => {
  const hasIndex = index !== undefined;
  const refFile = useRef<any>();
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { triggerTooltip } = useTooltip();

  const handleClick = () => {
    refFile.current.click();
  };

  const addFile = async (files: any) => {
    setUploadingDoc(true);
    await tryCatch(
      () =>
        Api.Bucket.uploadBucket(agreementId, files[0], {
          onUploadProgress: (event: any) => {
            setUploadProgress(Math.round((100 * event.loaded) / event.total));
          }
        }),
      toError
    )
      .fold(
        () => {
          setUploadingDoc(false);
          setUploadProgress(0);
        },
        response => {
          setFieldValue(
            hasIndex
              ? `discounts[${index}].lastBucketCodeFileUid`
              : "lastBucketCodeFileUid",
            response.data.uid
          );
          setUploadingDoc(false);
          setUploadProgress(0);
        }
      )
      .run();
  };

  const deleteFile = async () =>
    await tryCatch(() => new Promise(constNull), toError)
      .fold(() => void 0, constNull)
      .run();

  return (
    <div className="border-bottom py-4">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row align-items-center">
          {uploadedDoc && <DocumentSuccess className="mr-4" />}
          {uploadedDoc ? (
            <div className="d-flex flex-column ">
              <a href={uploadedDoc.documentUrl}>{label}</a>
              <span className="text-gray">
                {formatDate(uploadedDoc.documentTimestamp)}
              </span>
            </div>
          ) : (
            <i>{label}</i>
          )}
        </div>
        {!uploadingDoc && (
          <>
            <div className="d-flex flex-row">
              {!uploadedDoc && (
                <Button
                  color="primary"
                  icon
                  size="sm"
                  tag="button"
                  onClick={handleClick}
                >
                  Carica file
                  <input
                    type="file"
                    hidden
                    ref={refFile}
                    onChange={() => addFile(refFile.current.files)}
                  />
                </Button>
              )}
            </div>
            {uploadedDoc && <DeleteDocument onDelete={deleteFile} />}
          </>
        )}
      </div>
      {uploadingDoc && (
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

export default Bucket;
