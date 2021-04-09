import React from "react";

type Props = {
  isActive?: boolean;
  index?: number;
  children: string;
  handleChangeStep: any;
};

const Step = ({
  isActive = false,
  index,
  handleChangeStep,
  children
}: Props) => (
  <li
    className={isActive ? "active no-line" : "no-line"}
    onClick={handleChangeStep}
  >
    {index && <span className="steppers-number">{index}</span>}
    {children}
  </li>
);

export default Step;
