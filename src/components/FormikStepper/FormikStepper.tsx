import React, { useState } from "react";
import { Formik, Form, FormikConfig, FormikValues } from "formik";
import Stepper from "../Stepper/Stepper";
import Step from "../Stepper/Step";
import FormikStepProps from "./FormikStepProps.interface";

const FormikStepper = ({ children, ...props }: FormikConfig<FormikValues>) => {
  const childrenArray = React.Children.toArray(children) as Array<
    React.ReactElement<FormikStepProps>
  >;
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step] as React.ReactElement<
    FormikStepProps
  >;

  function isLastStep() {
    return step === childrenArray.length;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
        } else {
          setStep(s => s + 1);
        }
      }}
    >
      {({ values }) => (
        <Form autoComplete="off">
          <Stepper>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                index={index + 1}
                stepType={step === index ? "active" : ""}
                handleChangeStep={() => setStep(index)}
              >
                {child.props.label}
              </Step>
            ))}
          </Stepper>
          {React.Children.map(currentChild, child =>
            React.cloneElement(child, { formValues: values })
          )}
        </Form>
      )}
    </Formik>
  );
};

export default FormikStepper;
