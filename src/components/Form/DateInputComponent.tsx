import React, { Ref } from "react";
import CalendarIcon from "../../assets/icons/calendar.svg";

type Props = {
  ref: any;
  value: string;
  onClick: () => void;
};

const DateInputComponent = (props:Props): React.ReactElement => (
  <div className="form-group">
    <div className="input-group">
      <div className="input-group-prepend">
        <div className="input-group-text"><CalendarIcon/></div>
      </div>
      <input aria-describedby="date-input-description" type="text" className="form-control" id="input-group-2" name="input-group-2" placeholder="dd-mm-yy" onClick={props.onClick} defaultValue={props.value}/>
    </div>
    <small id="date-input-description" className="form-text text-muted">gg/mm/aaaa</small>
  </div>
);

export default DateInputComponent;