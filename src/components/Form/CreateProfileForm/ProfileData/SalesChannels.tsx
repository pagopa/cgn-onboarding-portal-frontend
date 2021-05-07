import React from "react";
import { ErrorMessage, Field, FieldArray } from "formik";
import { Button } from "design-react-kit";
import FormSection from "../../FormSection";
import InputFieldMultiple from "../../InputFieldMultiple";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import FieldError from "../../FieldError";
import SalesChannelDiscountCodeType from "./SalesChannelDiscountCodeType";

const hasOfflineOrBothChannels = (channelType: string) =>
  channelType === "OfflineChannel" || channelType === "BothChannels";

const hasOnlineOrBothChannels = (channelType: string) =>
  channelType === "OnlineChannel" || channelType === "BothChannels";

const hasBothChannels = (channelType: string) => channelType === "BothChannels";

type Props = {
  errors: any;
  touched: any;
  handleBack: any;
  formValues: any;
  isValid: any;
};

const SalesChannels = ({
  errors,
  touched,
  handleBack,
  formValues,
  isValid
}: any) => (
  <>
    <FormSection
      title="Definizione del canale di vendita"
      description="Seleziona una delle opzioni disponibili"
      required
      isVisible={false}
    >
      <div className="d-flex flex-column">
        <div className="form-check">
          <Field
            type="radio"
            id="OfflineChannel"
            name="salesChannel.channelType"
            value="OfflineChannel"
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="OfflineChannel"
          >
            <span className="text-sm">Fisico</span>
          </label>
        </div>
        <div className="form-check">
          <Field
            type="radio"
            id="OnlineChannel"
            name="salesChannel.channelType"
            value="OnlineChannel"
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="OnlineChannel"
          >
            <span className="text-sm">Online</span>
          </label>
        </div>
        <div className="form-check">
          <Field
            type="radio"
            id="BothChannels"
            name="salesChannel.channelType"
            value="BothChannels"
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="BothChannels"
          >
            <span className="text-sm">Entrambi</span>
          </label>
        </div>
      </div>
    </FormSection>
    {hasOnlineOrBothChannels(formValues.salesChannel.channelType) && (
      <SalesChannelDiscountCodeType />
    )}
    {hasOfflineOrBothChannels(formValues.salesChannel.channelType) && (
      <FieldArray
        name="salesChannel.addresses"
        render={arrayHelpers => (
          <>
            {formValues.salesChannel.addresses.map(
              (address: any, index: number) => (
                <FormSection
                  key={index}
                  title={
                    index + 1 >= 2 ? `Indirizzo ${index + 1}` : `Indirizzo`
                  }
                  description="Inserisci l'indirizzo del punto vendita, se si hanno più punti vendita inserisci gli indirizzi aggiuntivi"
                  required={index + 1 === 1}
                  isVisible
                >
                  <div key={index}>
                    <div className="mt-10 row">
                      <div className="col-7">
                        <InputFieldMultiple htmlFor="street" title="Indirizzo">
                          <Field
                            id="street"
                            name={`salesChannel.addresses[${index}].street`}
                            type="text"
                          />
                          <ErrorMessage
                            name={`salesChannel.addresses[${index}].street`}
                          />
                        </InputFieldMultiple>
                      </div>
                      <div className="col-2 offset-1">
                        <InputFieldMultiple htmlFor="zipCode" title="CAP">
                          <Field
                            id="zipCode"
                            name={`salesChannel.addresses[${index}].zipCode`}
                            type="text"
                            placeholder="Inserisci il CAP"
                          />
                          <ErrorMessage
                            name={`salesChannel.addresses[${index}].zipCode`}
                          />
                        </InputFieldMultiple>
                      </div>
                    </div>
                    <div className="mt-10 row">
                      <div className="col-6">
                        <InputFieldMultiple htmlFor="city" title="Città">
                          <Field
                            id="city"
                            name={`salesChannel.addresses[${index}].city`}
                            type="text"
                            placeholder="Inserisci la città"
                          />
                          <ErrorMessage
                            name={`salesChannel.addresses[${index}].city`}
                          />
                        </InputFieldMultiple>
                      </div>
                      <div className="col-3 offset-1">
                        <InputFieldMultiple
                          htmlFor="district"
                          title="Provincia"
                        >
                          <Field
                            id="district"
                            name={`salesChannel.addresses[${index}].district`}
                            type="text"
                            placeholder="Inserisci la provincia"
                          />
                          <ErrorMessage
                            name={`salesChannel.addresses[${index}].district`}
                          />
                        </InputFieldMultiple>
                      </div>
                    </div>

                    {formValues.salesChannel.addresses.length - 1 === index && (
                      <>
                        <div
                          className="mt-8 cursor-pointer"
                          onClick={() =>
                            arrayHelpers.push({
                              street: "",
                              zipCode: "",
                              city: "",
                              district: ""
                            })
                          }
                        >
                          <PlusCircleIcon className="mr-2" />
                          <span className="text-base font-weight-semibold text-blue">
                            Aggiungi un indirizzo
                          </span>
                        </div>
                        {!hasBothChannels(
                          formValues.salesChannel.channelType
                        ) && (
                          <div className="mt-10">
                            <Button
                              className="px-14 mr-4"
                              outline
                              color="primary"
                              tag="button"
                              onClick={handleBack}
                            >
                              Indietro
                            </Button>
                            <Button
                              type="submit"
                              className="px-14 mr-4"
                              color="primary"
                              tag="button"
                              disabled={!isValid}
                            >
                              Continua
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </FormSection>
              )
            )}
          </>
        )}
      ></FieldArray>
    )}
    {hasOnlineOrBothChannels(formValues.salesChannel.channelType) && (
      <FormSection
        title="Sito web"
        description="Inserire l'URL del proprio e-commerce"
        required
        isVisible
      >
        <Field id="websiteUrl" name="salesChannel.websiteUrl" type="text" />
        <ErrorMessage name="salesChannel.websiteUrl" />
        <div className="mt-10">
          <Button
            className="px-14 mr-4"
            outline
            color="primary"
            tag="button"
            onClick={handleBack}
          >
            Indietro
          </Button>
          <Button
            type="submit"
            className="px-14 mr-4"
            color="primary"
            tag="button"
            disabled={!isValid}
          >
            Continua
          </Button>
        </div>
      </FormSection>
    )}
  </>
);

export default SalesChannels;
