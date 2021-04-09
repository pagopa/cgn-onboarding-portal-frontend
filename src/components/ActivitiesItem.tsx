import React from "react";
import CheckCircle from "../assets/icons/check-circle.svg";

interface IProps {
  title: string;
  description: string;
  checked: boolean;
}

function ActivitiesItem({ title, description, checked }: IProps) {
  return (
    <div className="border-bottom text-left">
      <div className="d-flex justify-content-between">
        <h1 className="text-base font-weight-semibold">{title}</h1>
        {checked && <CheckCircle />}
      </div>
      <p className="text-sm">{description}</p>
    </div>
  );
}

export default ActivitiesItem;
