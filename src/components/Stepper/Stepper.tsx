import Step from "./Step";

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
    <div className="steppers bg-white shadow-sm">
      <div className="container">
        <ul className="steppers-header">
          {steps.map((step: Step, index: number) => (
            <Step
              key={step.key}
              index={index + 1}
              stepType={(() => {
                if (activeStep === index) {
                  return "active";
                }
                if (completedSteps.includes(step.key)) {
                  return "confirmed";
                }
                return "";
              })()}
              handleChangeStep={changeStep(step.key, index)}
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
};

export default Stepper;
