import React from "react";
import CheckCircleIcon from "../../assets/icons/check-circle.svg";
import CircleIcon from "../../assets/icons/circle.svg";

type Props = {
  children: any;
  description: string;
  checked: boolean;
  hasBorderBottom: boolean;
};

const ActivitiesItem = ({
  children,
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
      {children}
      {checked ? <CheckCircleIcon /> : <CircleIcon />}
    </div>
    <p className="text-sm m-0">{description}</p>
  </div>
);

export default ActivitiesItem;
