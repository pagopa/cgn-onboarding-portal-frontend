import React from "react";
import { Form, Formik, Field } from "formik";
import { GetOrgsParams } from "./OperatorActivations";

type FilterFormValues = {
  searchQuery: string | undefined;
  page: number;
};

const ActivationsFilter = ({
  refForm,
  getActivations
}: {
  refForm: any;
  getActivations: (params: GetOrgsParams) => void;
}) => {
  // eslint-disable-next-line functional/no-let
  let timeout: any = null;

  const initialValues: FilterFormValues = {
    searchQuery: "",
    page: 0
  };

  return (
    <Formik
      innerRef={refForm}
      initialValues={initialValues}
      onSubmit={values => {
        const params = {
          ...values,
          searchQuery: values.searchQuery || undefined
        };
        getActivations(params);
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
                Impostazioni di accesso
              </h2>
            )}

            <div className="d-flex justify-content-end flex-grow-1">
              <Field
                id="searchQuery"
                name="searchQuery"
                type="text"
                placeholder="Cerca Operatore"
                onChange={(e: { target: { value: any } }) => {
                  setFieldValue("searchQuery", e.target.value);
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

export default ActivationsFilter;
