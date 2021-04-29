import React, { useState, forwardRef } from "react";
import { Icon, Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, Formik, Field } from "formik";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

const RequestsFilter = ({ getAgreements }) => {
  const [isOpenDateModal, setOpenDateModal] = useState(false);
  const [isOpenStateModal, setOpenStateModal] = useState(false);
  let timeout;

  const toggleDateModal = () => {
    setOpenDateModal(!isOpenDateModal);
  };

  const toggleStateModal = () => {
    setOpenStateModal(!isOpenStateModal);
  };

  const DatePickerInput = forwardRef((fieldProps, ref) => (
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

  const getDateLabel = (requestDateFrom, requestDateTo): string => {
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

  const getStatesLabel = (states): string => {
    switch (states) {
      case "PendingAgreement":
        return "Da valutare";
      case "AssignedAgreementMe":
        return "In valutazione (da te)";
      case "AssignedAgreementOthers":
        return "In valutazione (da altri)";
      default:
        return "State";
    }
  };

  return (
    <Formik
      initialValues={{
        search: "",
        requestDateFrom: undefined,
        requestDateTo: undefined,
        states: undefined
      }}
      onSubmit={values => {
        const params = { ...values };
        if (params.states && params.states.includes("AssignedAgreement")) {
          params.assignee = params.states.split("AssignedAgreement");
          params.states = "AssignedAgreement";
        }
        getAgreements(params);
      }}
    >
      {({ values, submitForm, setFieldValue }) => (
        <Form>
          <div className="d-flex justify-content-between">
            <h2 className="h4 font-weight-bold text-dark-blue">
              Richieste di convenzione
            </h2>
            <div className="d-flex justify-content-end flex-grow-1">
              <div className="chip chip-lg m-1" onClick={toggleDateModal}>
                <span className="chip-label">
                  {getDateLabel(values.requestDateFrom, values.requestDateTo)}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
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
                    setFieldValue("states", undefined);
                  }}
                >
                  <Icon color="" icon="it-close" size="" />
                </button>
              </div>
              <Field
                id="search"
                name="search"
                type="text"
                placeholder="Cerca Richiesta"
                onChange={e => {
                  setFieldValue("search", e.target.value);
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    submitForm();
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
                    {({ field }) => (
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
                    {({ field }) => (
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
                  submitForm();
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
                  submitForm();
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
