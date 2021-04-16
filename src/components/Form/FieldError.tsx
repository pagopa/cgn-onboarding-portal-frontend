import React from "react";

type Props = {
  errors: any;
  touched: any;
};

const FieldError = ({ errors, touched }: Props) => (
  <>{errors && touched ? <div>{errors}</div> : null}</>
);

export default FieldError;
