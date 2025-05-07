import { forwardRef } from "react";
import CalendarIcon from "../../assets/icons/calendar.svg?react";

type Props = {
  value: string;
  onClick: () => void;
};

const DateInputComponent = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <div className="mb-12">
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

export default DateInputComponent;
