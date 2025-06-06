import { useRef, useState } from "react";
import { Form, Formik, Field } from "formik";
import { Button } from "design-react-kit";
import { saveAs } from "file-saver";
import { remoteData } from "../../api/common";
import { Severity, useTooltip } from "../../context/tooltip";
import DateModal from "./DateModal";

interface FilterFormValues {
  fullName: string | undefined;
  lastUpdateDateFrom: Date | undefined;
  lastUpdateDateTo: Date | undefined;
  page: number;
}

const ConventionFilter = ({
  refForm,
  getConventions
}: {
  refForm: any;
  getConventions: (params: any) => void;
}) => {
  const { triggerTooltip } = useTooltip();
  const [downloadingAgreements, setDownloadingAgreements] = useState(false);
  const [downloadingEyca, setDownloadingEyca] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const initialValues: FilterFormValues = {
    fullName: "",
    lastUpdateDateFrom: undefined,
    lastUpdateDateTo: undefined,
    page: 0
  };

  const getExport = async () => {
    try {
      setDownloadingAgreements(true);
      const data = await remoteData.Backoffice.Exports.exportAgreements.method(
        undefined,
        {
          headers: {
            "Content-Type": "text/csv"
          },
          responseType: "arraybuffer"
        }
      );
      const blob = new Blob([data], { type: "text/csv" });
      const today = new Date();
      saveAs(
        blob,
        `Esercenti CGN - ${today.getDate()}/${
          today.getMonth() + 1
        }/${today.getFullYear()}`
      );
    } catch {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Errore durante il download del file"
      });
    } finally {
      setDownloadingAgreements(false);
    }
  };

  const getExportEyca = async () => {
    try {
      setDownloadingEyca(true);
      const data =
        await remoteData.Backoffice.Exports.exportEycaDiscounts.method(
          undefined,
          {
            headers: {
              "Content-Type": "text/csv"
            },
            responseType: "arraybuffer"
          }
        );
      const blob = new Blob([data], { type: "text/csv" });
      const today = new Date();
      saveAs(
        blob,
        `Opportunità Eyca - ${today.getDate()}/${
          today.getMonth() + 1
        }/${today.getFullYear()}`
      );
    } catch {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Errore durante il download del file"
      });
    } finally {
      setDownloadingEyca(false);
    }
  };

  return (
    <Formik
      innerRef={refForm}
      initialValues={initialValues}
      onSubmit={values => {
        const params = {
          ...values,
          profileFullName: values.fullName || undefined
        };
        getConventions(params);
      }}
    >
      {({ values, submitForm, setFieldValue, resetForm, dirty }) => (
        <Form>
          <div className="d-flex justify-content-between">
            {dirty ? (
              <h2 className="h4 fw-bold text-dark-blue">
                Risultati della ricerca
                <span
                  className="primary-color ms-2 text-sm fw-regular cursor-pointer"
                  onClick={() => {
                    resetForm();
                    void submitForm();
                  }}
                >
                  Esci
                </span>
              </h2>
            ) : (
              <h2 className="h4 fw-bold text-dark-blue">
                Operatori convenzionati
              </h2>
            )}

            <div
              className="d-flex justify-content-end flex-grow-1 flex-wrap align-items-center"
              style={{ rowGap: "0.75rem" }}
            >
              <DateModal
                lastUpdateDateFrom={values.lastUpdateDateFrom}
                lastUpdateDateTo={values.lastUpdateDateTo}
                setFieldValue={setFieldValue}
                submitForm={submitForm}
              />
              <Field
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Cerca Operatore"
                onChange={(e: { target: { value: string } }) => {
                  void setFieldValue("fullName", e.target.value);
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  timeoutRef.current = window.setTimeout(() => {
                    void setFieldValue("page", 0);
                    void submitForm();
                  }, 1000);
                }}
                style={{ maxWidth: "275px" }}
              />
              <div>
                <Button
                  className="ms-5 btn-sm"
                  color="primary"
                  tag="button"
                  onClick={getExport}
                  disabled={downloadingAgreements}
                >
                  <span>Export convenzioni</span>
                </Button>
                <Button
                  className="ms-5 btn-sm"
                  color="primary"
                  tag="button"
                  onClick={getExportEyca}
                  disabled={downloadingEyca}
                >
                  <span>Export EYCA</span>
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ConventionFilter;
