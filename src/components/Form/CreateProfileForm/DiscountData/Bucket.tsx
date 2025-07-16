import { ComponentProps, memo, useEffect, useRef, useState } from "react";
import { Button, Progress } from "design-react-kit";
import { Field, FormikHelpers } from "formik";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Severity, useTooltip } from "../../../../context/tooltip";
import DocumentSuccess from "../../../../assets/icons/document-success.svg?react";
import CustomErrorMessage from "../../CustomErrorMessage";
import FormField from "../../FormField";
import bucketTemplate from "../../../../templates/test-codes";
import { BucketCodeLoadStatus } from "../../../../api/generated";
import { remoteData } from "../../../../api/common";
import { generateCsvDataUri } from "../../../../utils/generateCsvDataUri";
import { DiscountFormValues } from "../../discountFormUtils";

type Props = {
  label: string;
  agreementId: string;
  setFieldValue: FormikHelpers<
    DiscountFormValues | { discounts: Array<DiscountFormValues> }
  >["setFieldValue"];
} & (
  | {
      formValues: DiscountFormValues;
      index?: undefined;
    }
  | {
      formValues: { discounts: Array<DiscountFormValues> };
      index: number;
    }
);

const BucketComponent = ({
  index,
  label,
  agreementId,
  formValues,
  setFieldValue
}: Props) => {
  const hasIndex = index !== undefined;
  const refFile = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentDoc, setCurrentDoc] = useState<{ name: string } | undefined>(
    undefined
  );
  const [canUploadFile, setCanUploadFile] = useState(true);
  const { triggerTooltip } = useTooltip();

  const handleClick = () => {
    refFile.current?.click();
  };

  const loadStatus =
    index !== undefined
      ? formValues.discounts[index].lastBucketCodeLoadStatus
      : formValues.lastBucketCodeLoadStatus;

  const documentName =
    index !== undefined
      ? formValues.discounts[index].lastBucketCodeLoadFileName
      : formValues.lastBucketCodeLoadFileName;

  useEffect(() => {
    if (typeof documentName === "string" && documentName.length > 0) {
      setCurrentDoc({ name: documentName });
    }

    setCanUploadFile(
      loadStatus !== BucketCodeLoadStatus.Running &&
        loadStatus !== BucketCodeLoadStatus.Pending
    );
  }, [documentName, loadStatus, index]);

  const uploadBucketMutation = useMutation({
    async mutationFn({ file }: { file: File }) {
      try {
        const data = await remoteData.Index.Bucket.uploadBucket.method(
          {
            agreementId,
            document: file
          },
          {
            onUploadProgress(event) {
              setUploadProgress(
                Math.round((100 * event.loaded) / (event.total ?? Infinity))
              );
            }
          }
        );
        void setFieldValue(
          hasIndex
            ? `discounts[${index}].lastBucketCodeLoadUid`
            : "lastBucketCodeLoadUid",
          data.uid
        );
        void setFieldValue(
          hasIndex
            ? `discounts[${index}].lastBucketCodeLoadFileName`
            : "lastBucketCodeLoadFileName",
          file.name
        );
        setCurrentDoc({ name: file.name });
        setCanUploadFile(false);
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status === 400 &&
          error.response.data in ERROR_MESSAGES
        ) {
          triggerTooltip({
            severity: Severity.DANGER,
            text: ERROR_MESSAGES[
              error.response.data as keyof typeof ERROR_MESSAGES
            ]
          });
        } else {
          triggerTooltip({
            severity: Severity.DANGER,
            text: ERROR_MESSAGES.DEFAULT
          });
        }
        setUploadProgress(0);
      }
    }
  });

  return (
    <FormField
      htmlFor="lastBucketCodeLoadUid"
      isTitleHeading
      title="Carica la lista di codici sconto"
      description={
        <>
          Caricare un file .CSV con la lista di almeno 10.000 di codici sconto
          statici relativi all’opportunità.
          <br />
          Per maggiori informazioni, consultare la{" "}
          <a
            className="fw-semibold"
            href="https://docs.pagopa.it/carta-giovani-nazionale"
            target="_blank"
            rel="noreferrer"
          >
            Documentazione tecnica
          </a>{" "}
          o scaricare il{" "}
          <a
            href={generateCsvDataUri(bucketTemplate)}
            download={"template_bucket.csv"}
          >
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
                <DocumentSuccess className="me-4" />
                <div className="d-flex flex-column ">
                  <a href="#">{currentDoc.name}</a>
                </div>
              </>
            ) : (
              <i>{label}</i>
            )}
          </div>
          {!uploadBucketMutation.isPending && canUploadFile && (
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
                onChange={() => {
                  const file = refFile.current?.files?.[0];
                  if (file) {
                    uploadBucketMutation.mutate({ file });
                  }
                }}
              />
            </Button>
          )}
        </div>
        {uploadBucketMutation.isPending && (
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
    return previousValue === nextValue;
  }
  return false;
};

const Bucket = memo(BucketComponent, checkMemoization);

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
  BUCKET_CODES_MUST_BE_ALPHANUM_WITH_AT_LEAST_ONE_DIGIT_AND_ONE_CHAR:
    "Ogni codice della lista deve avere almeno un numero e una lettera.",
  NOT_ALLOWED_SPECIAL_CHARS:
    "Sono ammessi solo caratteri alfanumerici e il trattino (-). Non sono ammessi altri caratteri speciali.",
  ONE_OR_MORE_CODES_ARE_NOT_VALID: "Uno o più codici non sono validi",
  DEFAULT: "Caricamento del file fallito."
};
