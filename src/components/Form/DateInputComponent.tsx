import React, { forwardRef } from "react";
import CalendarIcon from "../../assets/icons/calendar.svg";

type Props = {
  value: string;
  onClick: () => void;
};

const DateInputComponent = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <div className="form-group">
    <div className="input-group">
      <div className="input-group-prepend">
        <div className="input-group-text">
          <CalendarIcon />
        </div>
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
