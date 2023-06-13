import { Field } from "formik";
import React from "react";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  index?: number;
};

const DiscountConditions = ({ index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <div className="row">
      <div className="col-6">
        <p className="text-sm font-weight-normal text-black mb-0">
          Italiano 🇮🇹
        </p>
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
      </div>
      <div className="col-6">
        <p className="text-sm font-weight-normal text-black mb-0">Inglese 🇬🇧</p>
        <Field
          as="textarea"
          id="condition_en"
          name={hasIndex ? `discounts[${index}].condition_en` : `condition_en`}
          placeholder="Type in a description"
          maxLength="200"
          rows="4"
        />
        <CustomErrorMessage
          name={hasIndex ? `discounts[${index}].condition_en` : `condition_en`}
        />
      </div>
    </div>
  );
};

export default DiscountConditions;
