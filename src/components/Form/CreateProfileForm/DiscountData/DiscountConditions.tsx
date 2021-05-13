import React from "react";
import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  index?: number;
};

const DiscountConditions = ({ index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <>
      <Field
        as="textarea"
        id="condition"
        name={hasIndex ? `discounts[${index}].condition` : `condition`}
        placeholder="Inserisci una descrizione"
        maxLength="200"
        rows="4"
      />
      <CustomErrorMessage
        name={hasIndex ? `discounts[${index}].condition` : `condition`}
      />
    </>
  );
};

export default DiscountConditions;
