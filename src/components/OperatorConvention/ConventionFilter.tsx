import React, { useState, forwardRef } from "react";
import { Icon, Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, Formik, Field, FieldInputProps } from "formik";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

interface FilterFormValues {
  fullName: string | undefined;
  lastUpdateDateFrom: Date | undefined;
  lastUpdateDateTo: Date | undefined;
}

const ConventionFilter = ({ refForm }: { refForm: any }) => {
  const [isOpenDateModal, setOpenDateModal] = useState(false);
  // eslint-disable-next-line functional/no-let
  let timeout: any = null;

  const toggleDateModal = () => {
    setOpenDateModal(!isOpenDateModal);
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
    dateFrom: Date | undefined,
    dateTo: Date | undefined
  ): string => {
    if (dateFrom && dateTo) {
      return `Dal ${format(dateFrom, "dd/MM/yyyy")} al ${format(
        dateTo,
        "dd/MM/yyyy"
      )}`;
    } else if (dateFrom) {
      return `Dal ${format(dateFrom, "dd/MM/yyyy")}`;
    } else if (dateTo) {
      return `Al ${format(dateTo, "dd/MM/yyyy")}`;
    }
    return "Data";
  };

  const initialValues: FilterFormValues = {
    fullName: "",
    lastUpdateDateFrom: undefined,
    lastUpdateDateTo: undefined
  };

  return (
    <Formik
      innerRef={refForm}
      initialValues={initialValues}
      onSubmit={values => {
        const params = {
          ...values,
          name: values.fullName || undefined
        };
        // TODO GET LIST
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
              <div className="chip chip-lg m-1" onClick={toggleDateModal}>
                <span className="chip-label">
                  {getDateLabel(
                    values.lastUpdateDateFrom,
                    values.lastUpdateDateTo
                  )}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setFieldValue("lastUpdateDateFrom", undefined);
                    setFieldValue("lastUpdateDateTo", undefined);
                  }}
                >
                  <Icon color="" icon="it-close" size="" />
                </button>
              </div>
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
                    void submitForm();
                  }, 1000);
                }}
                style={{ maxWidth: "275px" }}
              />
            </div>
          </div>
          {/* DATE MODAL */}
          <Modal isOpen={isOpenDateModal} toggle={toggleDateModal}>
            <ModalHeader toggle={toggleDateModal}>
              Filtra per data di ultimo aggiornamento
            </ModalHeader>
            <ModalBody>
              <div className="d-flex flex-column mt-4">
                <div className="form-check">
                  <Field name="lastUpdateDateFrom">
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={val => setFieldValue(field.name, val)}
                        selectsStart
                        startDate={values.lastUpdateDateFrom}
                        endDate={values.lastUpdateDateTo}
                        customInput={
                          <DatePickerInput label="A partire dal giorno" />
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="form-check">
                  <Field name="lastUpdateDateTo">
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={val => setFieldValue(field.name, val)}
                        selectsEnd
                        startDate={values.lastUpdateDateFrom}
                        endDate={values.lastUpdateDateTo}
                        minDate={values.lastUpdateDateFrom}
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
                  void submitForm();
                  toggleDateModal();
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

export default ConventionFilter;
