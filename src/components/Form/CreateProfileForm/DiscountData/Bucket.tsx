import { useEffect, useRef, useState } from "react";
import { Button, Progress } from "design-react-kit";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Lens } from "@hookform/lenses";
import { useController, useWatch } from "react-hook-form";
import { Severity, useTooltip } from "../../../../context/tooltip";
import DocumentSuccess from "../../../../assets/icons/document-success.svg?react";
import FormField from "../../FormField";
import bucketTemplate from "../../../../templates/test-codes";
import { BucketCodeLoadStatus } from "../../../../api/generated";
import { remoteData } from "../../../../api/common";
import { generateCsvDataUri } from "../../../../utils/generateCsvDataUri";
import { DiscountFormInputValues } from "../../discountFormUtils";
import { FormErrorMessage } from "../../../../utils/react-hook-form-helpers";

type Props = {
  label: string;
  agreementId: string;
  formLens: Lens<DiscountFormInputValues>;
};

const Bucket = ({ label, agreementId, formLens }: Props) => {
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

  const loadStatus = useWatch(
    formLens.focus("lastBucketCodeLoadStatus").interop()
  );

  const documentName = useWatch(
    formLens.focus("lastBucketCodeLoadFileName").interop()
  );

  const lastBucketCodeLoadUidController = useController(
    formLens.focus("lastBucketCodeLoadUid").interop()
  );
  const lastBucketCodeLoadUidOnChange =
    lastBucketCodeLoadUidController.field.onChange;

  const lastBucketCodeLoadFileNameController = useController(
    formLens.focus("lastBucketCodeLoadFileName").interop()
  );
  const lastBucketCodeLoadFileNameOnChange =
    lastBucketCodeLoadFileNameController.field.onChange;

  useEffect(() => {
    if (typeof documentName === "string" && documentName.length > 0) {
      setCurrentDoc({ name: documentName });
    }

    setCanUploadFile(
      loadStatus !== BucketCodeLoadStatus.Running &&
        loadStatus !== BucketCodeLoadStatus.Pending
    );
  }, [documentName, loadStatus]);

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
        lastBucketCodeLoadUidOnChange({ target: { value: data.uid } });
        lastBucketCodeLoadFileNameOnChange({ target: { value: file.name } });
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
        <FormErrorMessage formLens={formLens.focus("lastBucketCodeLoadUid")} />
      </div>
    </FormField>
  );
};

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
