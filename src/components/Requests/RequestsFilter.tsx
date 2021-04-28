import React, { useState, forwardRef } from "react";
import { Icon, Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, Formik, Field } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RequestsFilter = ({ getAgreements }) => {
  const [isOpenDateModal, setOpenDateModal] = useState(false);
  const [isOpenStateModal, setOpenStateModal] = useState(false);

  const toggleDateModal = () => {
    setOpenDateModal(!isOpenDateModal);
  };

  const toggleStateModal = () => {
    setOpenStateModal(!isOpenStateModal);
  };

  const DatePickerInput = forwardRef((fieldProps, ref) => (
    <div className="it-datepicker-wrapper">
      <div className="form-group">
        <input
          {...fieldProps}
          ref={ref}
          className="form-control it-date-datepicker"
          id="requestDateFrom"
          type="text"
          placeholder="gg/mm/aaaa"
        />
        <label htmlFor="requestDateFrom">A partire dal giorno</label>
      </div>
    </div>
  ));

  return (
    <Formik
      initialValues={{}}
      onSubmit={values => {
        console.log(values);
        // filterAgreements
      }}
    >
      {({ submitForm, setFieldValue }) => (
        <Form>
          <div className="d-flex justify-content-between">
            <h2 className="h4 font-weight-bold text-dark-blue">
              Richieste di convenzione
            </h2>
            <div className="d-flex">
              <div className="chip chip-lg" onClick={toggleDateModal}>
                <span className="chip-label">Data</span>
                <button>
                  <Icon color="" icon="it-close" size="" />
                </button>
              </div>
              <div className="chip chip-lg" onClick={toggleStateModal}>
                <span className="chip-label">Stato</span>
                <button>
                  <Icon color="" icon="it-close" size="" />
                </button>
              </div>
              <Field
                id="search"
                name="search"
                type="text"
                placeholder="Cerca Richiesta"
              />
            </div>
          </div>
          {/* DATE MODAL */}
          <Modal isOpen={isOpenDateModal} toggle={toggleDateModal}>
            <ModalHeader toggle={toggleDateModal}>Filtra per data</ModalHeader>
            <ModalBody>
              <div className="d-flex flex-column">
                <div className="form-check">
                  <Field name="requestDateFrom">
                    {({ field }) => (
                      <DatePicker
                        {...field}
                        selected={
                          (field.value && new Date(field.value)) || null
                        }
                        onChange={val => {
                          setFieldValue(field.name, val);
                        }}
                        customInput={<DatePickerInput />}
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
              <div className="d-flex flex-column">
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
                    <span className="text-sm">Da valutare</span>
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
                    <span className="text-sm">In valutazione (da te)</span>
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
                    <span className="text-sm">In valutazione (da altri)</span>
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
