import React from "react";
import { Field } from "formik";
import FormSection from "../../FormSection";
import InputField from "../../InputField";
import FieldError from "../../FieldError";

type Props = {
  errors: any;
  touched: any;
};

const DiscountInfo = ({ errors, touched }: Props) => (
  <FormSection hasIntroduction>
    <InputField
      htmlFor="name"
      title="Nome agevolazione"
      description="Inserire un breve testo che descriva il tipo di agevolazione offerta (max 100 caratteri)"
      isVisible
      required
    >
      <Field id="name" name="name" type="text" />
      <FieldError errors={errors.name} touched={touched.name} />
    </InputField>
    <InputField
      htmlFor="description"
      title="Descrizione agevolazione"
      description="Inserire una descrizione leggermente più approfondita dell'agevolazione, se lo ritenete necessario (es. Sconto valido per l'acquisto di due ingressi alla stagione di prosa 2021/22 presso il Teatro Comunale) - Max 250 caratteri"
      isVisible
      required
    >
      <Field
        as="textarea"
        id="description"
        name="description"
        placeholder="Inserisci una descrizione"
        maxLength="250"
        rows="4"
      />
      <FieldError errors={errors.description} touched={touched.description} />
    </InputField>
    <InputField
      htmlFor="startDate"
      title="Data di inizio dell'agevolazione"
      description="Indicare il giorno e l’ora da cui lagevolazione diventa valida"
      isVisible
      required
    >
      <Field id="startDate" name="startDate" type="text" />
      <FieldError errors={errors.startDate} touched={touched.startDate} />
    </InputField>
    <InputField
      htmlFor="endDate"
      title="Data di fine agevolazione"
      description="Indicare la data e l’ora da cui l’agevolazione non è più valida"
      isVisible
      required
    >
      <Field id="endDate" name="endDate" type="text" />
      <FieldError errors={errors.endDate} touched={touched.endDate} />
    </InputField>
    <InputField
      htmlFor="discountDiscount"
      title="Entità dello sconto"
      description="Inserire la percentuale di sconto erogata"
      isVisible
      required
    >
      <Field id="discount" name="discount" type="text" />
      <FieldError errors={errors.discount} touched={touched.discount} />
    </InputField>
  </FormSection>
);

export default DiscountInfo;
