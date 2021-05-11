import React from "react";
import Step from "./Step";

interface Step {
  label: string;
  key: string;
}

type Props = {
  activeStep: number;
  completedSteps: Array<string>;
  handleChangeStep: any;
  steps: Array<Step>;
};

const Stepper = ({
  activeStep,
  completedSteps,
  handleChangeStep,
  steps
}: Props) => (
  <div className="steppers bg-white shadow-sm">
    <div className="container">
      <ul className="steppers-header">
        {steps.map((step: Step, index: number) => (
          <Step
            key={step.key}
            index={index + 1}
            stepType={
              activeStep === index
                ? "active"
                : completedSteps.includes(step.key)
                ? "confirmed"
                : ""
            }
            handleChangeStep={
              completedSteps.includes(step.key)
                ? () => handleChangeStep(index)
                : null
            }
          >
            {step.label}
          </Step>
        ))}
        <li className="steppers-index" aria-hidden="true">
          {steps.map((step: Step, index: number) => (
            <span key={step.key}>{index}</span>
          ))}
        </li>
      </ul>
    </div>
  </div>
);

export default Stepper;
