import React from "react";
import CheckCircle from "../../assets/icons/check-circle.svg";
import Circle from "../../assets/icons/circle.svg";

type Props = {
  title: string;
  description: string;
  checked: boolean;
  hasBorderBottom: boolean;
};

const ActivitiesItem = ({
  title,
  description,
  checked,
  hasBorderBottom
}: Props) => (
  <div
    className={
      hasBorderBottom ? "border-bottom text-left p-6" : "text-left p-6"
    }
  >
    <div className="d-flex justify-content-between">
      <h1 className="text-base font-weight-semibold">{title}</h1>
      {checked ? <CheckCircle /> : <Circle />}
    </div>
    <p className="text-sm m-0">{description}</p>
  </div>
);

export default ActivitiesItem;
