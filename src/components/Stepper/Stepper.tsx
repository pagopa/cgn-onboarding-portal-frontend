import { Stepper as MuiStepper, Step, StepButton, Box } from "@mui/material";

interface Step {
  label: string;
  key: string;
}

type Props = {
  activeStep: number;
  completedSteps: Array<string>;
  handleChangeStep(step: number): void;
  steps: Array<Step>;
};

const Stepper = ({
  activeStep,
  completedSteps,
  handleChangeStep,
  steps
}: Props) => {
  const getClickHandler = (stepKey: string, index: number) => {
    if (
      completedSteps.includes(stepKey) ||
      completedSteps.includes(steps[index - 1]?.key)
    ) {
      return () => handleChangeStep(index);
    }
    return undefined;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <MuiStepper activeStep={activeStep} nonLinear>
        {steps.map((step, index) => {
          const isConfirmed = completedSteps.includes(step.key);
          const onClick = getClickHandler(step.key, index);
          return (
            <Step key={step.key} completed={isConfirmed}>
              <StepButton onClick={onClick} disabled={!onClick}>
                {step.label}
              </StepButton>
            </Step>
          );
        })}
      </MuiStepper>
    </Box>
  );
};

export default Stepper;
