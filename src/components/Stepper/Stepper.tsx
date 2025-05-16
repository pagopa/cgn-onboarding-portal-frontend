import { Icon } from "design-react-kit";
import { Fragment } from "react";

interface Step {
  label: string;
  key: string;
}

type Props = {
  activeStep: number;
  completedSteps: Array<string>;
  handleChangeStep(sterp: number): void;
  steps: Array<Step>;
};

const Stepper = ({
  activeStep,
  completedSteps,
  handleChangeStep,
  steps
}: Props) => {
  const changeStep = (stepKey: string, index: number) => {
    if (
      completedSteps.includes(stepKey) ||
      completedSteps.includes(steps[index - 1]?.key)
    ) {
      return () => handleChangeStep(index);
    }
  };

  return (
    <div className="container">
      <div className="steppers">
        <div className="steppers-header">
          <ul className="mb-0">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isConfirmed = completedSteps.includes(step.key);
              return (
                <li
                  key={step.key}
                  className={`${isActive ? "active" : ""} ${isConfirmed ? "confirmed" : ""} cursor-pointer`}
                  onClick={changeStep(step.key, index)}
                >
                  <span className="steppers-number">
                    {(isActive || !isConfirmed) && (
                      <Fragment>
                        <span className="visually-hidden">Step </span>
                        {index + 1}
                      </Fragment>
                    )}
                    {isConfirmed && !isActive && (
                      <Fragment>
                        <Icon icon="it-check" aria-hidden />
                        <span className="visually-hidden">Confermato</span>
                      </Fragment>
                    )}
                  </span>
                  {step.label}{" "}
                  {isActive && <span className="visually-hidden">Attivo</span>}
                </li>
              );
            })}
          </ul>
          <span className="steppers-index" aria-hidden="true">
            {steps.map((step, index) => (
              <span
                key={step.key}
                className={index === activeStep ? "active" : ""}
                onClick={changeStep(step.key, index)}
              >
                {index + 1}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
