import React from "react";
import { FormGroup } from "design-react-kit";
import { Label } from "reactstrap";

type Props = {
  htmlFor: string;
  text: string;
  children: any;
  required?: boolean;
};

const CheckboxField = ({ htmlFor, text, children }: Props) => (
  <FormGroup check tag="div">
    {children}
    <Label
      check
      for={htmlFor}
      tag="label"
      widths={["xs", "sm", "md", "lg", "xl"]}
    >
      {text}
    </Label>
  </FormGroup>
);

export default CheckboxField;
