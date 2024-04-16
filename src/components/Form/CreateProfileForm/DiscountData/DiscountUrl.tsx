import { Field } from "formik";
import * as React from "react";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  index?: number;
};

const DiscountUrl = ({ index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <>
      <Field
        id="discountUrl"
        name={hasIndex ? `discounts[${index}].discountUrl` : "discountUrl"}
        type="text"
        placeholder="Inserisci link (completo di protocollo http o https)"
      />
      <CustomErrorMessage
        name={hasIndex ? `discounts[${index}].discountUrl` : "discountUrl"}
      />
    </>
  );
};

export default DiscountUrl;
