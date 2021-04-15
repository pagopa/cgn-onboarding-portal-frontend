import React from "react";
import FormikStepProps from "./FormikStepProps.interface";

const FormikStep = ({ formValues, children }: any) =>
  React.Children.map(children, child =>
    React.cloneElement(child, { formValues })
  );

export default FormikStep;
