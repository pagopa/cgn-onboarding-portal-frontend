import React from "react";
import { Form, Formik, Field } from "formik";
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
  // eslint-disable-next-line functional/no-let
  let timeout: any = null;

  const initialValues: FilterFormValues = {
    fullName: "",
    lastUpdateDateFrom: undefined,
    lastUpdateDateTo: undefined,
    page: 0
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
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ConventionFilter;
