/* eslint-disable sonarjs/cognitive-complexity */

import { Field, FieldProps } from "formik";
import React from "react";
import DatePicker from "react-datepicker";
import CustomErrorMessage from "../../CustomErrorMessage";
import DateInputComponent from "../../DateInputComponent";
import InputField from "../../FormField";

type Props = {
  formValues?: any;
  setFieldValue?: any;
  index?: number;
};

const DiscountInfo = ({ formValues, setFieldValue, index }: Props) => {
  const hasIndex = index !== undefined;

  const dateFrom = hasIndex
    ? formValues.discounts[index as number].startDate
    : formValues.startDate;

  const dateTo = hasIndex
    ? formValues.discounts[index as number].endDate
    : formValues.endDate;

  return (
    <>
      <InputField
        htmlFor="name"
        title="Nome opportunità"
        description="Inserire un breve testo che descriva il tipo di opportunità offerta (max 100 caratteri)"
        isVisible
        required
      >
        <div className="row">
          <div className="col-6">
            <p className="text-sm font-weight-normal text-black mb-0">
              Italiano 🇮🇹
            </p>
            <Field
              maxLength={100}
              id="name"
              name={hasIndex ? `discounts[${index}].name` : "name"}
              type="text"
            />
            <CustomErrorMessage
              name={hasIndex ? `discounts[${index}].name` : "name"}
            />
          </div>
          <div className="col-6">
            <p className="text-sm font-weight-normal text-black mb-0">
              Inglese 🇬🇧
            </p>
            <Field
              maxLength={100}
              id="name"
              name={hasIndex ? `discounts[${index}].name_en` : "name_en"}
              type="text"
            />
            <CustomErrorMessage
              name={hasIndex ? `discounts[${index}].name_en` : "name_en"}
            />
          </div>
        </div>
      </InputField>
      <InputField
        htmlFor="description"
        title="Descrizione opportunità"
        description="Se necessario, inserire una descrizione più approfondita dell'opportunità (es. Sconto valido per l'acquisto di due ingressi alla stagione di prosa 2021/22 presso il Teatro Comunale) - Max 250 caratteri"
        isVisible
      >
        <div className="row">
          <div className="col-6">
            <p className="text-sm font-weight-normal text-black mb-0">
              Italiano 🇮🇹
            </p>
            <Field
              as="textarea"
              id="description"
              name={
                hasIndex ? `discounts[${index}].description` : "description"
              }
              placeholder="Inserisci una descrizione"
              maxLength="250"
              rows="4"
            />
            <CustomErrorMessage
              name={
                hasIndex ? `discounts[${index}].description` : "description"
              }
            />
          </div>
          <div className="col-6">
            <p className="text-sm font-weight-normal text-black mb-0">
              Inglese 🇬🇧
            </p>
            <Field
              as="textarea"
              id="description_en"
              name={
                hasIndex
                  ? `discounts[${index}].description_en`
                  : "description_en"
              }
              placeholder="Inserisci una descrizione"
              maxLength="250"
              rows="4"
            />
            <CustomErrorMessage
              name={
                hasIndex
                  ? `discounts[${index}].description_en`
                  : "description_en"
              }
            />
          </div>
        </div>
      </InputField>
      <div className="row">
        <div className="col-5">
          <InputField
            htmlFor="startDate"
            title="Data di inizio dell'opportunità"
            description="Indicare il giorno e l’ora da cui l'opportunità diventa valida"
            isVisible
            required
          >
            <DatePicker
              id="startDate"
              name={hasIndex ? `discounts[${index}].startDate` : "startDate"}
              dateFormat="dd/MM/yyyy"
              placeholderText={"dd-mm-yy"}
              minDate={new Date()}
              showDisabledMonthNavigation
              selected={dateFrom}
              selectsStart
              startDate={dateFrom}
              endDate={dateTo}
              onChange={date =>
                setFieldValue(
                  hasIndex ? `discounts[${index}].startDate` : "startDate",
                  date
                )
              }
              customInput={React.createElement(DateInputComponent)}
            />
            <CustomErrorMessage
              name={hasIndex ? `discounts[${index}].startDate` : "startDate"}
            />
          </InputField>
        </div>
        <div className="col-5 offset-1">
          <InputField
            htmlFor="endDate"
            title="Data di fine opportunità"
            description="Indicare la data e l’ora da cui l’opportunità non è più valida"
            isVisible
            required
          >
            <DatePicker
              id="endDate"
              name={hasIndex ? `discounts[${index}].endDate` : "endDate"}
              dateFormat="dd/MM/yyyy"
              placeholderText={"dd-mm-yy"}
              showDisabledMonthNavigation
              selected={dateTo}
              selectsEnd
              startDate={dateFrom}
              endDate={dateTo}
              minDate={dateFrom}
              onChange={date => {
                setFieldValue(
                  hasIndex ? `discounts[${index}].endDate` : "endDate",
                  date
                );
              }}
              customInput={React.createElement(DateInputComponent)}
            />
            <CustomErrorMessage
              name={hasIndex ? `discounts[${index}].endDate` : "endDate"}
            />
          </InputField>
        </div>
      </div>
      <InputField
        htmlFor="discount"
        title="Entità dello sconto"
        description="Se l'opportunità lo prevede, inserire la percentuale (%) di sconto erogata"
        isVisible
      >
        <Field
          id="discount"
          name={hasIndex ? `discounts[${index}].discount` : "discount"}
          type="text"
        >
          {({ field }: FieldProps) => (
            <div className="input-group col-4 p-0">
              <div className="input-group-prepend">
                <div className="input-group-text">%</div>
              </div>
              <input
                type="text"
                {...field}
                className="form-control"
                id="input-group-2"
                name="input-group-2"
                onChange={e =>
                  setFieldValue(
                    hasIndex ? `discounts[${index}].discount` : "discount",
                    e.target.value
                  )
                }
              />
            </div>
          )}
        </Field>
        <CustomErrorMessage
          name={hasIndex ? `discounts[${index}].discount` : "discount"}
        />
      </InputField>
    </>
  );
};

export default DiscountInfo;
