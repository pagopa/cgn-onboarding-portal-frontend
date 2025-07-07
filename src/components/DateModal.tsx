import { useState, forwardRef } from "react";
import { Button, Icon } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { format } from "date-fns";
import DatePicker from "react-datepicker";

const DateModal = ({
  from: propDateFrom,
  to: propDateTo,
  onSubmit,
  label,
  title
}: {
  from?: Date;
  to?: Date;
  onSubmit(propDateFrom: Date | undefined, propDateTo: Date | undefined): void;
  label: string;
  title: string;
}) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(propDateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(propDateTo);
  const [isOpenDateModal, setOpenDateModal] = useState(false);

  const toggleDateModal = () => {
    setOpenDateModal(!isOpenDateModal);
  };

  const getDateLabel = (
    propDateFrom: Date | undefined,
    propDateTo: Date | undefined
  ): string => {
    if (propDateFrom && propDateTo) {
      return `Dal ${format(propDateFrom, "dd/MM/yyyy")} al ${format(
        propDateTo,
        "dd/MM/yyyy"
      )}`;
    } else if (propDateFrom) {
      return `Dal ${format(propDateFrom, "dd/MM/yyyy")}`;
    } else if (propDateTo) {
      return `Al ${format(propDateTo, "dd/MM/yyyy")}`;
    }
    return label;
  };

  const DatePickerInput = forwardRef((fieldProps: any, ref: any) => (
    <div className="it-datepicker-wrapper" style={{ width: "100%" }}>
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
  ));

  return (
    <>
      <div
        className="chip chip-lg m-1 cursor-pointer"
        onClick={toggleDateModal}
      >
        <span className="chip-label">
          {getDateLabel(propDateFrom, propDateTo)}
        </span>
        {(propDateFrom || propDateTo) && (
          <button
            onClick={e => {
              e.stopPropagation();
              onSubmit(undefined, undefined);
            }}
          >
            <Icon color="" icon="it-close" size="" />
          </button>
        )}
      </div>

      <Modal isOpen={isOpenDateModal} toggle={toggleDateModal}>
        <ModalHeader toggle={toggleDateModal}>{title}</ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column mt-4">
            <div className="form-check">
              <DatePicker
                name="propDateFrom"
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                selected={dateFrom}
                onChange={val =>
                  setDateFrom(
                    val ? new Date(format(val, "yyyy-MM-dd")) : undefined
                  )
                }
                selectsStart
                startDate={dateFrom}
                endDate={dateTo}
                customInput={<DatePickerInput label="A partire dal giorno" />}
              />
            </div>
            <div className="form-check">
              <DatePicker
                name="propDateTo"
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                selected={dateTo}
                onChange={val =>
                  setDateTo(
                    val ? new Date(format(val, "yyyy-MM-dd")) : undefined
                  )
                }
                selectsEnd
                startDate={dateFrom}
                endDate={dateTo}
                minDate={dateFrom}
                customInput={<DatePickerInput label="Fino al giorno" />}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              onSubmit(dateFrom, dateTo);
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
