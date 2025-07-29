import DatePicker from "react-datepicker";
import { createElement, forwardRef } from "react";
import { Lens } from "@hookform/lenses";
import { useController, useWatch } from "react-hook-form";
import FormField from "../../FormField";
import { DiscountFormInputValues } from "../../discountFormUtils";
import { FormErrorMessage } from "../../../../utils/react-hook-form-helpers";
import CalendarIcon from "../../../../assets/icons/calendar.svg?react";

export function DiscountDates({
  formLens
}: {
  formLens: Lens<DiscountFormInputValues>;
}) {
  const startDate = useWatch(formLens.focus("startDate").interop());
  const startDateController = useController(
    formLens.focus("startDate").interop()
  );
  const setStartDate = (date: Date | undefined) =>
    startDateController.field.onChange({ target: { value: date } });
  const endDate = useWatch(formLens.focus("endDate").interop());
  const endDateController = useController(formLens.focus("endDate").interop());
  const setEndDate = (date: Date | undefined) =>
    endDateController.field.onChange({ target: { value: date } });
  return (
    <div className="row">
      <div className="col-6">
        <FormField
          htmlFor="startDate"
          title="Data d'inizio opportunità"
          description="Indica la data e l’ora in cui far iniziare l’opportunità"
          isVisible
          required
        >
          <DatePicker
            id="startDate"
            name={startDateController.field.name}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            showMonthDropdown
            minDate={new Date()}
            selected={startDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            onChange={date => {
              if (endDate && date && date > endDate) {
                setEndDate(undefined);
              }
              setStartDate(date ?? undefined);
            }}
            customInput={createElement(DateInputComponent)}
          />
          <div>
            <FormErrorMessage formLens={formLens.focus("startDate")} />
          </div>
        </FormField>
      </div>
      <div className="col-6">
        <FormField
          htmlFor="endDate"
          title="Data di fine opportunità"
          description="Indica la data e l’ora in cui far finire l’opportunità"
          isVisible
          required
        >
          <DatePicker
            id="endDate"
            name={endDateController.field.name}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            showMonthDropdown
            minDate={new Date()}
            selected={endDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            onChange={date => {
              if (startDate && date && date < startDate) {
                setStartDate(undefined);
              }
              setEndDate(date ?? undefined);
            }}
            customInput={createElement(DateInputComponent)}
          />
          <div>
            <FormErrorMessage formLens={formLens.focus("endDate")} />
          </div>
        </FormField>
      </div>
    </div>
  );
}

const DateInputComponent = forwardRef<
  HTMLInputElement,
  {
    value: string;
    onClick: () => void;
  }
>((props, ref) => (
  <div>
    <div className="input-group">
      <div className="input-group-text">
        <CalendarIcon />
      </div>
      <input
        aria-describedby="date-input-description"
        type="text"
        className="form-control"
        id="input-group-2"
        name="input-group-2"
        placeholder="gg/mm/aaaa"
        onClick={props.onClick}
        value={props.value ?? ""}
        readOnly
        ref={ref}
        style={{
          backgroundColor: "transparent",
          cursor: "pointer"
        }}
      />
    </div>
    <small id="date-input-description" className="form-text text-muted">
      gg/mm/aaaa
    </small>
  </div>
));
