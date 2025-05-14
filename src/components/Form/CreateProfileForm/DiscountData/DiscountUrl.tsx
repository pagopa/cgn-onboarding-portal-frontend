import { Field } from "formik";
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
        className="form-control"
      />
      <CustomErrorMessage
        name={hasIndex ? `discounts[${index}].discountUrl` : "discountUrl"}
      />
    </>
  );
};

export default DiscountUrl;
