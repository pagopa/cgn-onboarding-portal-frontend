/* eslint-disable sonarjs/cognitive-complexity */

import { Field, FieldProps } from "formik";
import React from "react";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import CustomErrorMessage from "../../CustomErrorMessage";
import DateInputComponent from "../../DateInputComponent";
import InputField from "../../FormField";
import FormField from "../../FormField";
import { MAX_SELECTABLE_CATEGORIES } from "../../../../utils/constants";
import { Profile } from "../../../../api/generated";
import { RootState } from "../../../../store/store";
import ProductCategories from "./ProductCategories";
import DiscountConditions from "./DiscountConditions";
import EnrollToEyca from "./EnrollToEyca";
import Bucket from "./Bucket";
import LandingPage from "./LandingPage";
import StaticCode from "./StaticCode";
import DiscountUrl from "./DiscountUrl";

type Props = {
  formValues?: any;
  setFieldValue?: any;
  index?: number;
  profile: Profile | undefined;
};

// eslint-disable-next-line complexity
const DiscountInfo = ({ formValues, setFieldValue, index, profile }: Props) => {
  const hasIndex = index !== undefined;

  const dateFrom = hasIndex
    ? formValues.discounts[index as number].startDate
    : formValues.startDate;

  const dateTo = hasIndex
    ? formValues.discounts[index as number].endDate
    : formValues.endDate;

  const { checkBucket, checkLanding, checkStaticCode } = getDiscountTypeChecks(
    profile
  );

  const agreement = useSelector((state: RootState) => state.agreement.value);

  return (
    <>
      <h1
        className="h4 font-weight-bold text-dark-blue"
        style={{ margin: "-1.5rem 0" }}
      >
        Dati dell’opportunità
      </h1>
      <InputField
        htmlFor="name"
        title="Nome opportunità"
        description="Inserisci un breve testo che descriva il tipo di opportunità offerta (max 100 caratteri)"
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
        description="Se necessario, inserisci una descrizione più approfondita dell’opportunità - Max 250 caratteri"
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
              placeholder="Es. Sconto valido per l’acquisto di due ingressi per la stagione di prosa 2021/2022 presso il Teatro Comunale"
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
              placeholder="Ex. Discount valid for the purchase of two tickets for the 2021/2022 prose season at the Municipal Theatre"
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
            title="Data di inizio dell’opportunità"
            description="Indica la data e l’ora in cui far iniziare l’opportunità"
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
            description="Indica la data e l’ora in cui far finire l’opportunità"
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
        description="Se l’opportunità lo prevede, inserire la percentuale (%) di sconto erogata"
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
      <FormField
        htmlFor="productCategories"
        isTitleHeading
        title="Categorie merceologiche"
        description={`Seleziona al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche a cui appatengono i beni/servizi oggetto dell’opportunità`}
        isVisible
        required
      >
        <ProductCategories
          selectedCategories={formValues.productCategories}
          index={index}
        />
      </FormField>
      <FormField
        htmlFor="discountConditions"
        isTitleHeading
        title="Condizioni dell’opportunità"
        description="Descrivi eventuali condizioni d’uso o limitazioni relative all’opportunità - Max 200 caratteri"
        isVisible
      >
        <DiscountConditions index={index} />
      </FormField>
      {!checkLanding && (
        <FormField
          htmlFor="discountUrl"
          title="Link all’opportunità"
          description="Inserisci l’URL del sito o dell’app dove sarà possibile accedere all’opportunità"
          isTitleHeading
          isVisible
        >
          <DiscountUrl index={index} />
        </FormField>
      )}
      {checkStaticCode && (
        <FormField
          htmlFor="staticCode"
          isTitleHeading
          title="Codice statico"
          description="Inserisci il codice che l’utente dovrà inserire per usufruire dell’opportunità"
          isVisible
          required
        >
          <StaticCode index={index} />
        </FormField>
      )}
      {checkLanding && (
        <FormField
          htmlFor="landingPage"
          isTitleHeading
          title="Indirizzo della landing page*"
          description="Inserisci l’URL della pagina web da cui sarà possibile accedere all’opportunità"
          isVisible
          required
        >
          <LandingPage index={index} />
        </FormField>
      )}
      {checkBucket && (
        <Bucket
          agreementId={agreement.id}
          label={"Seleziona un file dal computer"}
          index={index}
          formValues={formValues}
          setFieldValue={setFieldValue}
        />
      )}
      {profile && (
        <EnrollToEyca
          profile={profile}
          index={index}
          formValues={formValues}
          setFieldValue={setFieldValue}
        />
      )}
    </>
  );
};

export default DiscountInfo;

export function getDiscountTypeChecks(profile: Profile | undefined) {
  const onlineOrBoth =
    profile?.salesChannel?.channelType === "OnlineChannel" ||
    profile?.salesChannel?.channelType === "BothChannels";

  const checkStaticCode =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "Static";

  const checkLanding =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "LandingPage";

  const checkBucket =
    onlineOrBoth &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "Bucket";

  return { checkStaticCode, checkLanding, checkBucket };
}
