import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { Button, Progress } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Field } from "formik";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { Severity, useTooltip } from "../../../../context/tooltip";
import Api from "../../../../api";
import DocumentSuccess from "../../../../assets/icons/document-success.svg";
import CustomErrorMessage from "../../CustomErrorMessage";
import chainAxios from "../../../../utils/chainAxios";
import FormField from "../../FormField";
import bucketTemplate from "../../../../templates/test-codes.csv";

type Props = {
  label: string;
  formValues: any;
  setFieldValue: any;
  agreementId: string;
  index?: number;
};

const BucketComponent = ({
  index,
  label,
  agreementId,
  formValues,
  setFieldValue
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const hasIndex = index !== undefined;
  const refFile = useRef<any>();
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentDoc, setCurrentDoc] = useState<{ name: string } | undefined>(
    undefined
  );
  const { triggerTooltip } = useTooltip();

  const handleClick = () => {
    refFile.current.click();
  };

  useEffect(() => {
    const documentName =
      index !== undefined
        ? formValues.discounts[index].lastBucketCodeFileName
        : formValues.lastBucketCodeFileName;

    if (NonEmptyString.is(documentName)) {
      setCurrentDoc({ name: documentName });
    }
  }, [formValues, index]);

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
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        () => {
          setUploadingDoc(false);
          setUploadProgress(0);
          triggerTooltip({
            severity: Severity.DANGER,
            text: "Caricamento del file fallito"
          });
        },
        data => {
          setFieldValue(
            hasIndex
              ? `discounts[${index}].lastBucketCodeFileUid`
              : "lastBucketCodeFileUid",
            data.uid
          );
          setFieldValue(
            hasIndex
              ? `discounts[${index}].lastBucketCodeFileName`
              : "lastBucketCodeFileName",
            files[0].name
          );
          setCurrentDoc({ name: files[0].name });
          setUploadingDoc(false);
          setUploadProgress(0);
        }
      )
      .run();
  };

  return (
    <FormField
      htmlFor="lastBucketCodeFileUid"
      isTitleHeading
      title="Carica la lista di codici sconto"
      description={
        <>
          Caricare un file .CSV con la lista di almeno 1.000.000 di codici
          sconto statici relativi all’agevolazione.
          <br />
          Per maggiori informazioni, consultare la{" "}
          <a
            className="font-weight-semibold"
            href="https://pagopa.gitbook.io/documentazione-tecnica-portale-operatori-1.0.0"
            target="_blank"
            rel="noreferrer"
          >
            Documentazione tecnica
          </a>{" "}
          o scaricare il{" "}
          <a href={bucketTemplate} download={"template_bucket.csv"}>
            file di esempio
          </a>
        </>
      }
      isVisible
      required
    >
      <div className="border-bottom py-4">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex flex-row align-items-center">
            {currentDoc ? (
              <>
                <DocumentSuccess className="mr-4" />
                <div className="d-flex flex-column ">
                  <a href="#">{currentDoc.name}</a>
                </div>
              </>
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
              <Field
                name={
                  hasIndex
                    ? `discounts[${index}].lastBucketCodeFileUid`
                    : "lastBucketCodeFileUid"
                }
                hidden
              />
              <Field
                name={
                  hasIndex
                    ? `discounts[${index}].lastBucketCodeFileName`
                    : "lastBucketCodeFileName"
                }
                hidden
              />
              <input
                type="file"
                accept="text/csv"
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
        <CustomErrorMessage
          name={
            hasIndex
              ? `discounts[${index}].lastBucketCodeFileName`
              : "lastBucketCodeFileName"
          }
        />
      </div>
    </FormField>
  );
};

const checkMemoization = (
  prev: ComponentProps<typeof BucketComponent>,
  next: ComponentProps<typeof BucketComponent>
): boolean => {
  if (prev.index === next.index) {
    const previousValue =
      prev.index !== undefined
        ? prev.formValues.discounts[prev.index].lastBucketCodeFileUid
        : prev.formValues.lastBucketCodeFileUid;
    const nextValue =
      next.index !== undefined
        ? next.formValues.discounts[next.index].lastBucketCodeFileUid
        : next.formValues.lastBucketCodeFileUid;
    if (previousValue === nextValue) {
      return true;
    }
    return false;
  }
  return false;
};

const Bucket = React.memo(BucketComponent, checkMemoization);

export default Bucket;
