import React from "react";
import { Field, FieldArray } from "formik";
import { Button, Icon } from "design-react-kit";
// import AsyncSelect from "react-select/async";
// import Axios from "axios";
// import { tryCatch } from "fp-ts/lib/TaskEither";
// import { toError } from "fp-ts/lib/Either";
import FormSection from "../../FormSection";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import CustomErrorMessage from "../../CustomErrorMessage";
// import chainAxios from "../../../../utils/chainAxios";
import ToggleField from "../../ToggleField";
import InputFieldMultiple from "../../InputFieldMultiple";
import SalesChannelDiscountCodeType from "./SalesChannelDiscountCodeType";

const hasOfflineOrBothChannels = (channelType: string) =>
  channelType === "OfflineChannel" || channelType === "BothChannels";

const hasOnlineOrBothChannels = (channelType: string) =>
  channelType === "OnlineChannel" || channelType === "BothChannels";

const hasBothChannels = (channelType: string) => channelType === "BothChannels";

type Props = {
  handleBack: any;
  formValues: any;
  isValid: boolean;
  setFieldValue: any;
  // geolocationToken: string;
};

const SalesChannels = ({
  handleBack,
  formValues,
  isValid,
  setFieldValue
}: // geolocationToken
Props) => (
  // const autocomplete = async (q: any) =>
  //   await tryCatch(
  //     () =>
  //       Axios.get("https://geocode.search.hereapi.com/v1/geocode", {
  //         params: {
  //           apiKey: geolocationToken,
  //           q,
  //           lang: "it",
  //           in: "countryCode:ITA"
  //         }
  //       }),
  //     toError
  //   )
  //     .chain(chainAxios)
  //     .map((response: any) => response.data)
  //     .fold(
  //       () => [{ value: "", label: "" }],
  //       profile =>
  //         profile.items.map((item: any) => ({
  //           value: item.title,
  //           label: item.title,
  //           fullAddress: item.title,
  //           coordinates: {
  //             latitude: item.position.lat,
  //             longitude: item.position.lng
  //           }
  //         }))
  //     )
  //     .run();

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
    {hasOnlineOrBothChannels(formValues.salesChannel?.channelType) && (
      <SalesChannelDiscountCodeType />
    )}
    {hasOfflineOrBothChannels(formValues.salesChannel?.channelType) && (
      <FieldArray
        name="salesChannel.addresses"
        render={arrayHelpers => (
          <>
            {formValues.salesChannel?.addresses?.map(
              (_: any, index: number) => (
                <FormSection
                  key={index}
                  title={
                    index + 1 >= 2 ? `Indirizzo ${index + 1}` : `Indirizzo`
                  }
                  description="Inserisci l'indirizzo completo del/i punto/i vendita per permetterne la corretta visualizzazione del pin sulla mappa in app IO"
                  required={
                    formValues.salesChannel?.allNationalAddresses !== true &&
                    index + 1 === 1
                  }
                  isVisible
                >
                  {index === 0 && (
                    <ToggleField
                      small={false}
                      htmlFor="allNationalAddresses"
                      text="Rappresenti un franchising e vuoi che le agevolazioni valgano in tutti i punti vendita presenti sul territorio nazionale?"
                    >
                      <Field
                        id="allNationalAddresses"
                        name="salesChannel.allNationalAddresses"
                        type="checkbox"
                        onClick={() =>
                          setFieldValue("salesChannel.addresses", [
                            {
                              street: "",
                              zipCode: "",
                              city: "",
                              district: ""
                            }
                          ])
                        }
                      />
                    </ToggleField>
                  )}

                  <div key={index}>
                    {!!index &&
                      formValues.salesChannel?.allNationalAddresses ===
                        false && (
                        <Icon
                          icon="it-close"
                          style={{
                            position: "absolute",
                            right: "0",
                            top: "40px",
                            cursor: "pointer"
                          }}
                          onClick={() => arrayHelpers.remove(index)}
                        />
                      )}
                    {formValues.salesChannel?.allNationalAddresses ===
                      false && (
                      // <div className="mt-10 row">
                      //   <div className="col-7">
                      //     <AsyncSelect
                      //       placeholder="Inserisci indirizzo"
                      //       cacheOptions
                      //       loadOptions={autocomplete}
                      //       noOptionsMessage={() => "Nessun risultato"}
                      //       value={formValues.salesChannel.addresses[index]}
                      //       onChange={(e: any) =>
                      //         setFieldValue(
                      //           `salesChannel.addresses[${index}]`,
                      //           e
                      //         )
                      //       }
                      //     />
                      //   </div>
                      // </div>
                      <>
                        <div className="mt-10 row">
                          <div className="col-7">
                            <InputFieldMultiple
                              htmlFor="street"
                              title="Indirizzo"
                            >
                              <Field
                                id="street"
                                name={`salesChannel.addresses[${index}].street`}
                                type="text"
                              />
                              <CustomErrorMessage
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
                              <CustomErrorMessage
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
                              <CustomErrorMessage
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
                                maxLength={2}
                                id="district"
                                name={`salesChannel.addresses[${index}].district`}
                                type="text"
                                placeholder="Inserisci la provincia"
                              />
                              <CustomErrorMessage
                                name={`salesChannel.addresses[${index}].district`}
                              />
                            </InputFieldMultiple>
                          </div>
                        </div>
                      </>
                    )}
                    {formValues.salesChannel?.addresses?.length ===
                      index + 1 && (
                      <>
                        {formValues.salesChannel?.allNationalAddresses ===
                          false && (
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
                        )}
                        {!hasBothChannels(
                          formValues.salesChannel?.channelType
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
      />
    )}
    {hasOnlineOrBothChannels(formValues.salesChannel?.channelType) && (
      <FormSection
        title="Sito web"
        description="Inserire l'URL del proprio e-commerce o del proprio sito istituzionale"
        required
        isVisible
      >
        <Field id="websiteUrl" name="salesChannel.websiteUrl" type="text" />
        <CustomErrorMessage name="salesChannel.websiteUrl" />
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
