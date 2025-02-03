import React from "react";
import { Form, Formik, Field } from "formik";
import {
  AgreementApiGetAgreementsRequest,
  GetAgreementsAssigneeEnum
} from "../../api/generated_backoffice";
import DateModal from "./DateModal";
import StateModal from "./StateModal";

interface FilterFormValues {
  profileFullName: string | undefined;
  requestDateFrom: Date | undefined;
  requestDateTo: Date | undefined;
  states: string | undefined;
  assignee: GetAgreementsAssigneeEnum | undefined;
  page: number;
}

const RequestsFilter = ({
  getAgreements,
  refForm
}: {
  getAgreements: (params: AgreementApiGetAgreementsRequest) => void;
  refForm: any;
}) => {
  // eslint-disable-next-line functional/no-let
  let timeout: any = null;

  const initialValues: FilterFormValues = {
    profileFullName: "",
    requestDateFrom: undefined,
    requestDateTo: undefined,
    states: undefined,
    assignee: undefined,
    page: 0
  };

  return (
    <Formik
      innerRef={refForm}
      initialValues={initialValues}
      onSubmit={values => {
        const params = {
          ...values,
          profileFullName: values.profileFullName || undefined
        };
        if (params.states?.includes("AssignedAgreement")) {
          const splitFilter = params.states?.split("AssignedAgreement");
          // eslint-disable-next-line functional/immutable-data
          params.assignee = splitFilter[
            splitFilter.length - 1
          ] as GetAgreementsAssigneeEnum;
          // eslint-disable-next-line functional/immutable-data
          params.states = "AssignedAgreement";
        }
        getAgreements({
          ...params,
          requestDateFrom: params.requestDateFrom?.toISOString(),
          requestDateTo: params.requestDateTo?.toISOString()
        });
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
                Richieste di convenzione
              </h2>
            )}

            <div className="d-flex justify-content-end flex-grow-1 flex-wrap">
              <DateModal
                requestDateFrom={values.requestDateFrom}
                requestDateTo={values.requestDateTo}
                submitForm={submitForm}
                setFieldValue={setFieldValue}
              />

              <StateModal
                states={values.states}
                submitForm={submitForm}
                setFieldValue={setFieldValue}
              />

              <Field
                id="profileFullName"
                name="profileFullName"
                type="text"
                placeholder="Cerca Richiesta"
                onChange={(e: { target: { value: any } }) => {
                  setFieldValue("profileFullName", e.target.value);
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

export default RequestsFilter;
