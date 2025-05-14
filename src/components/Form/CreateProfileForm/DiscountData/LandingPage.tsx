import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  children?: React.ReactNode;
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
        placeholder="Inserisci indirizzo (completo di protocollo http o https)"
        type="text"
        className="form-control"
      />
      <CustomErrorMessage
        name={
          hasIndex ? `discounts[${index}].landingPageUrl` : "landingPageUrl"
        }
      />
      <p className="mt-4 text-sm fw-normal text-black">
        {
          "Inserisci il valore del parametro referrer da trasmettere alla pagina web"
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
        className="form-control"
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
