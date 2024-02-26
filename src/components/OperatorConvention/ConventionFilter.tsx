import React, { useState } from "react";
import { Form, Formik, Field } from "formik";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { saveAs } from "file-saver";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
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
  const [downloadingAgreements, setDownloadingAgreements] = useState(false);
  const [downloadingEyca, setDownloadingEyca] = useState(false);
  // eslint-disable-next-line functional/no-let
  let timeout: any = null;

  const initialValues: FilterFormValues = {
    fullName: "",
    lastUpdateDateFrom: undefined,
    lastUpdateDateTo: undefined,
    page: 0
  };

  const getExport = async () => {
    setDownloadingAgreements(true);
    await tryCatch(
      () =>
        Api.Exports.exportAgreements({
          headers: {
            "Content-Type": "text/csv"
          },
          responseType: "arraybuffer"
        }),
      toError
    )
      .map(response => response.data)
      .fold(
        () => {
          setDownloadingAgreements(false);
        },
        response => {
          if (response) {
            const blob = new Blob([response], { type: "text/csv" });
            const today = new Date();
            saveAs(
              blob,
              `Esercenti CGN - ${today.getDate()}/${today.getMonth() +
                1}/${today.getFullYear()}`
            );
          }
          setDownloadingAgreements(false);
        }
      )
      .run();
  };

  const getExportEyca = async () => {
    setDownloadingEyca(true);
    await tryCatch(
      () =>
        Api.Exports.exportEycaDiscounts({
          headers: {
            "Content-Type": "text/csv"
          },
          responseType: "arraybuffer"
        }),
      toError
    )
      .map(response => response.data)
      .fold(
        () => {
          setDownloadingEyca(false);
        },
        response => {
          if (response) {
            const blob = new Blob([response], { type: "text/csv" });
            const today = new Date();
            saveAs(
              blob,
              `Opportunità Eyca - ${today.getDate()}/${today.getMonth() +
                1}/${today.getFullYear()}`
            );
          }
          setDownloadingEyca(false);
        }
      )
      .run();
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
              <h2 className="h4 font-weight-bold text-dark-blue">
                Risultati della ricerca
                <span
                  className="primary-color ml-2 text-sm font-weight-regular cursor-pointer"
                  onClick={() => {
                    resetForm();
                    void submitForm();
                  }}
                >
                  Esci
                </span>
              </h2>
            ) : (
              <h2 className="h4 font-weight-bold text-dark-blue">
                Operatori convenzionati
              </h2>
            )}

            <div className="d-flex justify-content-end flex-grow-1">
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
                onChange={(e: { target: { value: any } }) => {
                  setFieldValue("fullName", e.target.value);
                  if (timeout) {
                    clearTimeout(timeout);
                  }
                  timeout = setTimeout(() => {
                    setFieldValue("page", 0);
                    void submitForm();
                  }, 1000);
                }}
                style={{ maxWidth: "275px" }}
              />
              <Button
                className="ml-5 btn-sm"
                color="primary"
                tag="button"
                onClick={getExport}
                disabled={downloadingAgreements}
              >
                {downloadingAgreements ? (
                  <CenteredLoading />
                ) : (
                  <span>Export convenzioni</span>
                )}
              </Button>
              <Button
                className="ml-5 btn-sm"
                color="primary"
                tag="button"
                onClick={getExportEyca}
                disabled={downloadingEyca}
              >
                {downloadingEyca ? (
                  <CenteredLoading />
                ) : (
                  <span>Export EYCA</span>
                )}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ConventionFilter;
