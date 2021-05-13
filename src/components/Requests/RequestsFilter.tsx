import React, { useState, forwardRef } from "react";
import { Icon, Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, Formik, Field, FieldInputProps } from "formik";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

interface FilterFormValues {
  profileFullName: string | undefined;
  requestDateFrom: Date | undefined;
  requestDateTo: Date | undefined;
  states: string | undefined;
  assignee: string | undefined;
  page: number;
}

const RequestsFilter = ({
  getAgreements,
  refForm
}: {
  getAgreements: (params: any) => void;
  refForm: any;
}) => {
  const [isOpenDateModal, setOpenDateModal] = useState(false);
  const [isOpenStateModal, setOpenStateModal] = useState(false);
  // eslint-disable-next-line functional/no-let
  let timeout: any = null;

  const toggleDateModal = () => {
    setOpenDateModal(!isOpenDateModal);
  };

  const toggleStateModal = () => {
    setOpenStateModal(!isOpenStateModal);
  };

  const DatePickerInput = forwardRef((fieldProps: any, ref: any) => (
    <div className="it-datepicker-wrapper" style={{ width: "100%" }}>
      <div className="form-group">
        <input
          {...fieldProps}
          ref={ref}
          className="form-control it-date-datepicker"
          id={fieldProps.name}
          type="text"
          placeholder="gg/mm/aaaa"
        />
        <label htmlFor={fieldProps.name}>{fieldProps.label}</label>
      </div>
    </div>
  ));

  const getDateLabel = (
    requestDateFrom: Date | undefined,
    requestDateTo: Date | undefined
  ): string => {
    if (requestDateFrom && requestDateTo) {
      return `Dal ${format(requestDateFrom, "dd/MM/yyyy")} al ${format(
        requestDateTo,
        "dd/MM/yyyy"
      )}`;
    } else if (requestDateFrom) {
      return `Dal ${format(requestDateFrom, "dd/MM/yyyy")}`;
    } else if (requestDateTo) {
      return `Al ${format(requestDateTo, "dd/MM/yyyy")}`;
    }
    return "Data";
  };

  const getStatesLabel = (states: string | undefined): string => {
    switch (states) {
      case "PendingAgreement":
        return "Da valutare";
      case "AssignedAgreementMe":
        return "In valutazione (da te)";
      case "AssignedAgreementOthers":
        return "In valutazione (da altri)";
      default:
        return "Stato";
    }
  };

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
          params.assignee = splitFilter[splitFilter.length - 1];
          // eslint-disable-next-line functional/immutable-data
          params.states = "AssignedAgreement";
        }
        getAgreements(params);
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

            <div className="d-flex justify-content-end flex-grow-1">
              <div className="chip chip-lg m-1" onClick={toggleDateModal}>
                <span className="chip-label">
                  {getDateLabel(values.requestDateFrom, values.requestDateTo)}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setFieldValue("page", 0);
                    setFieldValue("requestDateFrom", undefined);
                    setFieldValue("requestDateTo", undefined);
                  }}
                >
                  <Icon color="" icon="it-close" size="" />
                </button>
              </div>
              <div className="chip chip-lg m-1" onClick={toggleStateModal}>
                <span className="chip-label">
                  {getStatesLabel(values.states)}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setFieldValue("page", 0);
                    setFieldValue("states", undefined);
                  }}
                >
                  <Icon color="" icon="it-close" size="" />
                </button>
              </div>
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
          {/* DATE MODAL */}
          <Modal isOpen={isOpenDateModal} toggle={toggleDateModal}>
            <ModalHeader toggle={toggleDateModal}>Filtra per data</ModalHeader>
            <ModalBody>
              <div className="d-flex flex-column mt-4">
                <div className="form-check">
                  <Field name="requestDateFrom">
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={val => setFieldValue(field.name, val)}
                        selectsStart
                        startDate={values.requestDateFrom}
                        endDate={values.requestDateTo}
                        customInput={
                          <DatePickerInput label="A partire dal giorno" />
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="form-check">
                  <Field name="requestDateTo">
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={val => setFieldValue(field.name, val)}
                        selectsEnd
                        startDate={values.requestDateFrom}
                        endDate={values.requestDateTo}
                        minDate={values.requestDateFrom}
                        customInput={<DatePickerInput label="Fino al giorno" />}
                      />
                    )}
                  </Field>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  setFieldValue("page", 0);
                  void submitForm();
                  toggleDateModal();
                }}
              >
                Ok
              </Button>
            </ModalFooter>
          </Modal>
          {/* STATE MODAL */}
          <Modal isOpen={isOpenStateModal} toggle={toggleStateModal}>
            <ModalHeader toggle={toggleStateModal}>
              Filtra per stato
            </ModalHeader>
            <ModalBody>
              <div className="d-flex flex-column mt-2">
                <div className="form-check">
                  <Field
                    type="radio"
                    id="PendingAgreement"
                    name="states"
                    value="PendingAgreement"
                  />

                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="PendingAgreement"
                  >
                    <span className="text-sm">
                      {getStatesLabel("PendingAgreement")}
                    </span>
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    type="radio"
                    id="AssignedAgreementMe"
                    name="states"
                    value="AssignedAgreementMe"
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="AssignedAgreementMe"
                  >
                    <span className="text-sm">
                      {getStatesLabel("AssignedAgreementMe")}
                    </span>
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    type="radio"
                    id="AssignedAgreementOthers"
                    name="states"
                    value="AssignedAgreementOthers"
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="AssignedAgreementOthers"
                  >
                    <span className="text-sm">
                      {getStatesLabel("AssignedAgreementOthers")}
                    </span>
                  </label>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  setFieldValue("page", 0);
                  void submitForm();
                  toggleStateModal();
                }}
              >
                Ok
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default RequestsFilter;
