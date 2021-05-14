import React, { useState, forwardRef } from "react";
import { Button, Icon } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Field, FieldInputProps } from "formik";
import { format } from "date-fns";
import DatePicker from "react-datepicker";

const DateModal = ({
  requestDateFrom,
  requestDateTo,
  setFieldValue,
  submitForm
}: {
  requestDateFrom?: Date;
  requestDateTo?: Date;
  setFieldValue: any;
  submitForm: any;
}) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(requestDateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(requestDateTo);
  const [isOpenDateModal, setOpenDateModal] = useState(false);

  const toggleDateModal = () => {
    setOpenDateModal(!isOpenDateModal);
  };

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

  return (
    <>
      <div
        className="chip chip-lg m-1 cursor-pointer"
        onClick={toggleDateModal}
      >
        <span className="chip-label">
          {getDateLabel(requestDateFrom, requestDateTo)}
        </span>
        {(requestDateFrom || requestDateTo) && (
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
        )}
      </div>

      <Modal isOpen={isOpenDateModal} toggle={toggleDateModal}>
        <ModalHeader toggle={toggleDateModal}>Filtra per data</ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column mt-4">
            <div className="form-check">
              <Field name="requestDateFrom">
                {({ field }: { field: FieldInputProps<any> }) => (
                  <DatePicker
                    {...field}
                    dateFormat="dd/MM/yyyy"
                    selected={dateFrom}
                    onChange={(val: Date) =>
                      setDateFrom(new Date(format(val, "yyyy-MM-dd")))
                    }
                    selectsStart
                    startDate={dateFrom}
                    endDate={dateTo}
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
                    dateFormat="dd/MM/yyyy"
                    selected={dateTo}
                    onChange={(val: Date) =>
                      setDateTo(new Date(format(val, "yyyy-MM-dd")))
                    }
                    selectsEnd
                    startDate={dateFrom}
                    endDate={dateTo}
                    minDate={dateFrom}
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
              setFieldValue("requestDateFrom", dateFrom);
              setFieldValue("requestDateTo", dateTo);
              void submitForm();
              toggleDateModal();
            }}
          >
            Ok
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DateModal;
