import React from "react";
import { format } from "date-fns";
import { ErrorMessage, Field } from "formik";
import DatePicker from "react-datepicker";
import InputField from "../../FormField";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  formValues?: any;
  setFieldValue?: any;
  index?: number;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const DiscountInfo = ({ formValues, setFieldValue, index }: Props) => {
  const hasIndex = index !== undefined;

  return (
    <>
      <InputField
        htmlFor="name"
        title="Nome agevolazione"
        description="Inserire un breve testo che descriva il tipo di agevolazione offerta (max 100 caratteri)"
        isVisible
        required
      >
        <Field
          id="name"
          name={hasIndex ? `discounts[${index}].name` : "name"}
          type="text"
        />
        <ErrorMessage name={hasIndex ? `discounts[${index}].name` : "name"} />
      </InputField>
      <InputField
        htmlFor="description"
        title="Descrizione agevolazione"
        description="Inserire una descrizione leggermente più approfondita dell'agevolazione, se lo ritenete necessario (es. Sconto valido per l'acquisto di due ingressi alla stagione di prosa 2021/22 presso il Teatro Comunale) - Max 250 caratteri"
        isVisible
      >
        <Field
          as="textarea"
          id="description"
          name={hasIndex ? `discounts[${index}].description` : "description"}
          placeholder="Inserisci una descrizione"
          maxLength="250"
          rows="4"
        />
        <ErrorMessage
          name={hasIndex ? `discounts[${index}].description` : "description"}
        />
      </InputField>
      <InputField
        htmlFor="startDate"
        title="Data di inizio dell'agevolazione"
        description="Indicare il giorno e l’ora da cui l'agevolazione diventa valida"
        isVisible
        required
      >
        <DatePicker
          id="startDate"
          name={hasIndex ? `discounts[${index}].startDate` : "startDate"}
          dateFormat="yyyy-MM-dd"
          selected={
            hasIndex
              ? formValues.discounts[index as number].startDate
              : formValues.startDate
          }
          value={
            hasIndex
              ? formValues.discounts[index as number].startDate
              : formValues.startDate
          }
          onChange={date =>
            setFieldValue(
              hasIndex ? `discounts[${index}].startDate` : "startDate",
              date
            )
          }
        />
        <ErrorMessage
          name={hasIndex ? `discounts[${index}].startDate` : "startDate"}
        />
      </InputField>
      <InputField
        htmlFor="endDate"
        title="Data di fine agevolazione"
        description="Indicare la data e l’ora da cui l’agevolazione non è più valida"
        isVisible
        required
      >
        <DatePicker
          id="endDate"
          name={hasIndex ? `discounts[${index}].endDate` : "endDate"}
          dateFormat="yyyy-MM-dd"
          selected={
            hasIndex
              ? formValues.discounts[index as number].endDate
              : formValues.endDate
          }
          value={
            hasIndex
              ? formValues.discounts[index as number].endDate
              : formValues.endDate
          }
          onChange={date => {
            setFieldValue(
              hasIndex ? `discounts[${index}].endDate` : "endDate",
              date
            );
          }}
        />
        <ErrorMessage
          name={hasIndex ? `discounts[${index}].endDate` : "endDate"}
        />
      </InputField>
      <InputField
        htmlFor="discount"
        title="Entità dello sconto"
        description="Inserire la percentuale di sconto erogata"
        isVisible
        required
      >
        <Field
          id="discount"
          name={hasIndex ? `discounts[${index}].discount` : "discount"}
          type="text"
        />
        <ErrorMessage
          name={hasIndex ? `discounts[${index}].discount` : "discount"}
        />
      </InputField>
    </>
  );
};

export default DiscountInfo;
