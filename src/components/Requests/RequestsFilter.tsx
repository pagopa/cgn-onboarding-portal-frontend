import { Form, Formik, Field } from "formik";
import { useRef } from "react";
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
  const timeoutRef = useRef<number | null>(null);

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
          profileFullName: values.profileFullName || undefined,
          requestDateFrom: values.requestDateFrom?.toISOString(),
          requestDateTo: values.requestDateTo?.toISOString()
        };
        if (params.states?.includes("AssignedAgreement")) {
          const splitFilter = params.states?.split("AssignedAgreement");
          getAgreements({
            ...params,
            assignee: splitFilter[
              splitFilter.length - 1
            ] as GetAgreementsAssigneeEnum,
            states: "AssignedAgreement"
          });
        } else {
          getAgreements(params);
        }
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
                onChange={(e: { target: { value: string } }) => {
                  void setFieldValue("profileFullName", e.target.value);
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
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RequestsFilter;
