import React from "react";
import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  children?: any;
  index?: number;
};

const LandingPage = ({ children, index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <>
      <Field
        id="landing"
        name={
          hasIndex ? `discounts[${index}].landingPageUrl` : "landingPageUrl"
        }
        placeholder="Inserisci indirizzo"
        type="text"
      />
      <CustomErrorMessage
        name={
          hasIndex ? `discounts[${index}].landingPageUrl` : "landingPageUrl"
        }
      />
      <p className="mt-4 text-sm font-weight-normal text-black">
        {
          "Inserire il valore del parametro referrer da trasmettere alla landing page*"
        }
      </p>
      <Field
        id="landing"
        name={
          hasIndex
            ? `discounts[${index}].landingPageReferrer`
            : "landingPageReferrer"
        }
        placeholder="Inserisci valore referrer"
        type="text"
      />
      <CustomErrorMessage
        name={
          hasIndex
            ? `discounts[${index}].landingPageReferrer`
            : "landingPageReferrer"
        }
      />
      {children}
    </>
  );
};

export default LandingPage;
