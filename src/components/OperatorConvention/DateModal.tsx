import { useState, forwardRef } from "react";
import { Button, Icon } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Field, FieldInputProps } from "formik";
import { format } from "date-fns";
import DatePicker from "react-datepicker";

const DateModal = ({
  lastUpdateDateFrom,
  lastUpdateDateTo,
  setFieldValue,
  submitForm
}: {
  lastUpdateDateFrom?: Date;
  lastUpdateDateTo?: Date;
  setFieldValue: any;
  submitForm: any;
}) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    lastUpdateDateFrom
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(lastUpdateDateTo);
  const [isOpenDateModal, setOpenDateModal] = useState(false);

  const toggleDateModal = () => {
    setOpenDateModal(!isOpenDateModal);
  };

  const getDateLabel = (
    lastUpdateDateFrom: Date | undefined,
    lastUpdateDateTo: Date | undefined
  ): string => {
    if (lastUpdateDateFrom && lastUpdateDateTo) {
      return `Dal ${format(lastUpdateDateFrom, "dd/MM/yyyy")} al ${format(
        lastUpdateDateTo,
        "dd/MM/yyyy"
      )}`;
    } else if (lastUpdateDateFrom) {
      return `Dal ${format(lastUpdateDateFrom, "dd/MM/yyyy")}`;
    } else if (lastUpdateDateTo) {
      return `Al ${format(lastUpdateDateTo, "dd/MM/yyyy")}`;
    }
    return "Data ultima modifica";
  };

  const DatePickerInput = forwardRef((fieldProps: any, ref: any) => (
    <div className="it-datepicker-wrapper" style={{ width: "100%" }}>
      <div className="mb-12">
        <input
          {...fieldProps}
          ref={ref}
          className="form-control it-date-datepicker"
          id={fieldProps.name}
          type="text"
          placeholder="gg/mm/aaaa"
        />
        <label htmlFor={fieldProps.name} className="form-label">
          {fieldProps.label}
        </label>
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
          {getDateLabel(lastUpdateDateFrom, lastUpdateDateTo)}
        </span>
        {(lastUpdateDateFrom || lastUpdateDateTo) && (
          <button
            onClick={e => {
              e.stopPropagation();
              setFieldValue("page", 0);
              setFieldValue("lastUpdateDateFrom", undefined);
              setFieldValue("lastUpdateDateTo", undefined);
              submitForm();
            }}
          >
            <Icon color="" icon="it-close" size="" />
          </button>
        )}
      </div>

      <Modal isOpen={isOpenDateModal} toggle={toggleDateModal}>
        <ModalHeader toggle={toggleDateModal}>
          Filtra per data di ultima modifica
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column mt-4">
            <div className="form-check">
              <Field name="lastUpdateDateFrom">
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
              <Field name="lastUpdateDateTo">
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
              setFieldValue("lastUpdateDateFrom", dateFrom);
              setFieldValue("lastUpdateDateTo", dateTo);
              submitForm();
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
