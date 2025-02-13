import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { Button, Progress } from "design-react-kit";
import { Field } from "formik";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { Severity, useTooltip } from "../../../../context/tooltip";
import Api from "../../../../api";
import DocumentSuccess from "../../../../assets/icons/document-success.svg";
import CustomErrorMessage from "../../CustomErrorMessage";
import FormField from "../../FormField";
import bucketTemplate from "../../../../templates/test-codes.csv";
import { BucketCodeLoadStatus } from "../../../../api/generated";
import { normalizeAxiosResponse } from "../../../../utils/normalizeAxiosResponse";

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
  const [canUploadFile, setCanUploadFile] = useState(true);
  const { triggerTooltip } = useTooltip();

  const handleClick = () => {
    refFile.current.click();
  };

  useEffect(() => {
    const documentName =
      index !== undefined
        ? formValues.discounts[index].lastBucketCodeLoadFileName
        : formValues.lastBucketCodeLoadFileName;

    const importStatus =
      index !== undefined
        ? formValues.discounts[index].lastBucketCodeLoadStatus
        : formValues.lastBucketCodeLoadStatus;

    if (NonEmptyString.is(documentName)) {
      setCurrentDoc({ name: documentName });
    }

    setCanUploadFile(
      importStatus !== BucketCodeLoadStatus.Running &&
        importStatus !== BucketCodeLoadStatus.Pending
    );
  }, [formValues, index]);

  const addFile = async (files: any) => {
    setUploadingDoc(true);
    const response = await normalizeAxiosResponse(
      Api.Bucket.uploadBucket(agreementId, files[0], {
        onUploadProgress: (event: any) => {
          setUploadProgress(Math.round((100 * event.loaded) / event.total));
        }
      })
    );
    if (response.status === 200 || response.status === 204) {
      setFieldValue(
        hasIndex
          ? `discounts[${index}].lastBucketCodeLoadUid`
          : "lastBucketCodeLoadUid",
        response.data.uid
      );
      setFieldValue(
        hasIndex
          ? `discounts[${index}].lastBucketCodeLoadFileName`
          : "lastBucketCodeLoadFileName",
        files[0].name
      );
      setCurrentDoc({ name: files[0].name });
      setCanUploadFile(false);
    } else if (
      response.status === 400 &&
      (response.data as string) in ERROR_MESSAGES
    ) {
      triggerTooltip({
        severity: Severity.DANGER,
        text: ERROR_MESSAGES[response.data as keyof typeof ERROR_MESSAGES]
      });
    } else {
      triggerTooltip({
        severity: Severity.DANGER,
        text: ERROR_MESSAGES.DEFAULT
      });
    }
    setUploadingDoc(false);
    setUploadProgress(0);
  };

  const loadStatus =
    index !== undefined
      ? formValues.discounts[index].lastBucketCodeLoadStatus
      : formValues.lastBucketCodeLoadStatus;

  return (
    <FormField
      htmlFor="lastBucketCodeLoadUid"
      isTitleHeading
      title="Carica la lista di codici sconto"
      description={
        <>
          Caricare un file .CSV con la lista di almeno 1.000.000 di codici
          sconto statici relativi all’opportunità.
          <br />
          Per maggiori informazioni, consultare la{" "}
          <a
            className="font-weight-semibold"
            href="https://docs.pagopa.it/carta-giovani-nazionale"
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
          {!uploadingDoc && canUploadFile && (
            <Button
              color="primary"
              icon
              size="sm"
              tag="button"
              onClick={handleClick}
            >
              {loadStatus === BucketCodeLoadStatus.Failed ||
              loadStatus === BucketCodeLoadStatus.Finished
                ? "Carica un nuovo file"
                : "Carica file"}
              <Field
                name={
                  hasIndex
                    ? `discounts[${index}].lastBucketCodeLoadUid`
                    : "lastBucketCodeLoadUid"
                }
                hidden
              />
              <Field
                name={
                  hasIndex
                    ? `discounts[${index}].lastBucketCodeLoadFileName`
                    : "lastBucketCodeLoadFileName"
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
              ? `discounts[${index}].lastBucketCodeLoadUid`
              : "lastBucketCodeLoadUid"
          }
        />
        <CustomErrorMessage
          name={
            hasIndex
              ? `discounts[${index}].lastBucketCodeLoadFileName`
              : "lastBucketCodeLoadFileName"
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
        ? prev.formValues.discounts[prev.index].lastBucketCodeLoadUid
        : prev.formValues.lastBucketCodeLoadUid;
    const nextValue =
      next.index !== undefined
        ? next.formValues.discounts[next.index].lastBucketCodeLoadUid
        : next.formValues.lastBucketCodeLoadUid;
    if (previousValue === nextValue) {
      return true;
    }
    return false;
  }
  return false;
};

const Bucket = React.memo(BucketComponent, checkMemoization);

export default Bucket;

const ERROR_MESSAGES = {
  CSV_NAME_OR_EXTENSION_NOT_VALID:
    "Il formato del documento non è valido. Carica un documento CSV e riprova.",
  MAX_ALLOWED_BUCKET_CODE_LENGTH_NOT_RESPECTED:
    "Ogni codice della lista non deve superare i 20 caratteri.",
  BUCKET_CODES_MUST_BE_ALPHANUM_WITH_AT_LEAST_ONE_DIGIT_AND_CHAR:
    "Ogni codice della lista deve avere almeno un numero e una lettera.",
  CANNOT_LOAD_BUCKET_FOR_NOT_RESPECTED_MINIMUM_BOUND:
    "La lista caricata deve contenere almeno 10000 codici. Carica un'altra lista e riprova.",
  DEFAULT: "Caricamento del file fallito."
};
