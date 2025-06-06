import { Field, FieldArray, useFormikContext } from "formik";
import { InferType } from "yup";
import FormSection from "../../FormSection";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg?react";
import CustomErrorMessage from "../../CustomErrorMessage";
import ToggleField from "../../ToggleField";
import InputFieldMultiple from "../../InputFieldMultiple";
import { EntityType, SalesChannelType } from "../../../../api/generated";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";
import SalesChannelDiscountCodeType from "./SalesChannelDiscountCodeType";

type Props = {
  entityType: EntityType | undefined;
  children?: React.ReactNode;
};

const SalesChannels = ({ entityType, children }: Props) => {
  type Values = InferType<typeof ProfileDataValidationSchema>;
  const formikContext = useFormikContext<Values>();
  const formValues = formikContext.values;
  const hasOnlineOrBothChannels =
    formValues.salesChannel?.channelType === "OnlineChannel" ||
    formValues.salesChannel?.channelType === "BothChannels";
  const hasWebsite =
    hasOnlineOrBothChannels || entityType === EntityType.PublicAdministration;
  return (
    <>
      <SalesChannelDiscountCodeType />
      <FieldArray
        name="salesChannel.addresses"
        render={arrayHelpers => (
          <>
            {formValues.salesChannel?.addresses?.map((_, index, array) => (
              <FormSection
                key={index}
                title={index + 1 >= 2 ? `Indirizzo ${index + 1}` : `Indirizzo`}
                description="Inserisci l'indirizzo completo della sede. Servirà agli utenti per usufruire delle opportunità del tuo operatore, se richiedono una sede fisica."
                required={(() => {
                  switch (entityType) {
                    case EntityType.Private: {
                      if (formValues.salesChannel?.allNationalAddresses) {
                        return false;
                      }
                      return (
                        formValues.salesChannel.channelType ===
                          SalesChannelType.OfflineChannel && index + 1 === 1
                      );
                    }
                    case EntityType.PublicAdministration: {
                      return (
                        formValues.salesChannel.channelType === "OfflineChannel"
                      );
                    }
                  }
                })()}
                isVisible
                hasRemove={index !== 0}
                onRemove={() => arrayHelpers.remove(index)}
              >
                {index === 0 && (
                  <ToggleField
                    small={false}
                    htmlFor="allNationalAddresses"
                    text={(() => {
                      switch (entityType) {
                        case EntityType.Private:
                          return "Rappresenti un franchising e vuoi che le opportunità valgano in tutti i punti vendita presenti sul territorio nazionale?";
                        case EntityType.PublicAdministration:
                        default:
                          return "Rappresenti un ente e vuoi che le opportunità valgano in tutti i punti vendita presenti sul territorio nazionale?";
                      }
                    })()}
                  >
                    <Field
                      id="allNationalAddresses"
                      name="salesChannel.allNationalAddresses"
                      type="checkbox"
                      onClick={() =>
                        formikContext.setFieldValue("salesChannel.addresses", [
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
                  {formValues.salesChannel?.allNationalAddresses === false && (
                    <>
                      <div className="mt-10 row">
                        <div className="col-6">
                          <InputFieldMultiple
                            htmlFor="street"
                            title="Indirizzo"
                          >
                            <Field
                              id="street"
                              name={`salesChannel.addresses[${index}].street`}
                              type="text"
                              placeholder="Inserisci l'indirizzo"
                              className="form-control"
                            />
                            <CustomErrorMessage
                              name={`salesChannel.addresses[${index}].street`}
                            />
                          </InputFieldMultiple>
                        </div>
                        <div className="col-6">
                          <InputFieldMultiple htmlFor="zipCode" title="CAP">
                            <Field
                              id="zipCode"
                              name={`salesChannel.addresses[${index}].zipCode`}
                              type="text"
                              placeholder="Inserisci il CAP"
                              className="form-control"
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
                              className="form-control"
                            />
                            <CustomErrorMessage
                              name={`salesChannel.addresses[${index}].city`}
                            />
                          </InputFieldMultiple>
                        </div>
                        <div className="col-6">
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
                              className="form-control"
                            />
                            <CustomErrorMessage
                              name={`salesChannel.addresses[${index}].district`}
                            />
                          </InputFieldMultiple>
                        </div>
                      </div>
                    </>
                  )}
                  {formValues.salesChannel?.addresses?.length === index + 1 && (
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
                          <PlusCircleIcon className="me-2" />
                          <span className="text-base fw-semibold text-blue">
                            Aggiungi un indirizzo
                          </span>
                        </div>
                      )}
                      {!hasWebsite && index === array.length - 1
                        ? children
                        : null}
                    </>
                  )}
                </div>
              </FormSection>
            ))}
          </>
        )}
      />
      {hasWebsite && (
        <FormSection
          title="Sito web"
          description={(() => {
            switch (entityType) {
              case EntityType.Private:
                return "Inserire l'URL del proprio e-commerce o del proprio sito istituzionale";
              case EntityType.PublicAdministration:
              default:
                return "Inserisci l’URL del tuo e-commerce o sito per permettere alle persone di conoscere la tua attività";
            }
          })()}
          required
          isVisible
        >
          <Field
            id="websiteUrl"
            name="salesChannel.websiteUrl"
            type="text"
            placeholder="Inserisci un sito web (completo di protocollo https)"
            className="form-control"
          />
          <CustomErrorMessage name="salesChannel.websiteUrl" />
          {children}
        </FormSection>
      )}
    </>
  );
};

export default SalesChannels;
