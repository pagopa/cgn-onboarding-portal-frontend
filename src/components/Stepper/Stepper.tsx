import React from "react";
import Step from "./Step";

type Props = {
  activeStep: number;
  completedSteps: Array<number>;
  handleChangeStep: any;
  children: any;
};

const Stepper = ({
  activeStep,
  completedSteps,
  handleChangeStep,
  children
}: Props) => (
  <div className="steppers bg-white shadow-sm">
    <div className="container">
      <ul className="steppers-header">
        {children.map((child: any, index: number) => (
          <Step
            key={child.props.children}
            index={index + 1}
            stepType={
              activeStep === index
                ? "active"
                : completedSteps.includes(index)
                ? "confirmed"
                : "null"
            }
            handleChangeStep={
              () => handleChangeStep(index)
              /*
              completedSteps.includes(index)
                ? () => handleChangeStep(index)
                : null */
            }
          >
            {child.props.children}
          </Step>
        ))}
        <li className="steppers-index" aria-hidden="true">
          {children.map((child: any, index: number) => (
            <span key={child.props.children}>{index}</span>
          ))}
        </li>
      </ul>
    </div>
  </div>
);

export default Stepper;
