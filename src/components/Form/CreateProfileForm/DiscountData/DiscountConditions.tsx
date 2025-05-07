import { Field } from "formik";
import CustomErrorMessage from "../../CustomErrorMessage";

type Props = {
  index?: number;
};

const DiscountConditions = ({ index }: Props) => {
  const hasIndex = index !== undefined;
  return (
    <div className="row">
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Italiano 🇮🇹</p>
        <Field
          as="textarea"
          id="condition"
          name={hasIndex ? `discounts[${index}].condition` : `condition`}
          placeholder="Es. Sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro."
          maxLength="200"
          rows="4"
        />
        <CustomErrorMessage
          name={hasIndex ? `discounts[${index}].condition` : `condition`}
        />
      </div>
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
        <Field
          as="textarea"
          id="condition_en"
          name={hasIndex ? `discounts[${index}].condition_en` : `condition_en`}
          placeholder="Ex. Discount valid for the purchase of only one prose season ticket at the theatre’s counters "
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
