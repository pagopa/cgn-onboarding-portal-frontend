import React, { useEffect, useRef, useState } from "react";
import { Button, Progress } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Severity, useTooltip } from "../../../../context/tooltip";
import Api from "../../../../api";
import DocumentSuccess from "../../../../assets/icons/document-success.svg";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  label: string;
  formValues: any;
  setFieldValue: any;
  agreementId: string;
  uploadedDoc?: { name: string };
  index?: number;
};

const Bucket = ({
  index,
  label,
  uploadedDoc,
  agreementId,
  formValues,
  setFieldValue
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const hasIndex = index !== undefined;
  const refFile = useRef<any>();
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentDoc, setCurrentDoc] = useState(uploadedDoc);
  const { triggerTooltip } = useTooltip();

  const handleClick = () => {
    refFile.current.click();
  };

  useEffect(() => {
    const hasDocument =
      (index !== undefined
        ? formValues.discounts[index].lastBucketCodeFileUid
        : formValues.lastBucketCodeFileUid) !== undefined;

    if (hasDocument) {
      setCurrentDoc({ name: "File già presente" });
    }
  }, []);

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
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          response.status
            ? setFieldValue(
                hasIndex
                  ? `discounts[${index}].lastBucketCodeFileUid`
                  : "lastBucketCodeFileUid",
                response.data.uid
              )
            : triggerTooltip({
                severity: Severity.DANGER,
                text: "Caricamento del file fallito"
              });
          setCurrentDoc({ name: files[0].name });
          setUploadingDoc(false);
          setUploadProgress(0);
        }
      )
      .run();
  };

  return (
    <div className="border-bottom py-4">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row align-items-center">
          {currentDoc && <DocumentSuccess className="mr-4" />}
          {currentDoc ? (
            <div className="d-flex flex-column ">
              <a href="#">{currentDoc.name}</a>
              {/* <span className="text-gray"> */}
              {/*  {formatDate(uploadedDoc.documentTimestamp)} */}
              {/* </span> */}
            </div>
          ) : (
            <i>{label}</i>
          )}
        </div>
        {!uploadingDoc && !currentDoc && (
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
      <CustomErrorMessage
        name={
          hasIndex
            ? `discounts[${index}].lastBucketCodeFileUid`
            : "lastBucketCodeFileUid"
        }
      />
    </div>
  );
};

export default Bucket;
