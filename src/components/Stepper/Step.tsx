import React from "react";
import CheckStepperIcon from "../../assets/icons/check-stepper.svg";

type Props = {
  stepType?: "active" | "confirmed" | "";
  index?: number;
  children: string;
  handleChangeStep?: any;
};

const Step = ({ stepType = "", index, handleChangeStep, children }: Props) => (
  <li
    className={stepType}
    onClick={handleChangeStep}
    style={{
      borderLeftWidth: index === 1 ? 0 : "1px",
      borderRightWidth: index === 4 ? 0 : "1px",
      cursor: handleChangeStep ? "pointer" : "default"
    }}
  >
    <span className={stepType !== "confirmed" ? "steppers-number" : ""}>
      {stepType === "confirmed" && <CheckStepperIcon className="mr-2" />}
      <span className="sr-only">Step {index}</span>
      {stepType !== "confirmed" && index}
    </span>
    {children}
    {stepType === "active" && <span className="sr-only">Attivo</span>}
  </li>
);

export default Step;
