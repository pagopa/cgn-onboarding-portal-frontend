import { Lens } from "@hookform/lenses";
import { useFieldArray } from "@hookform/lenses/rhf";
import { useWatch } from "react-hook-form";
import FormSection from "../../FormSection";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg?react";
import ToggleField from "../../ToggleField";
import InputFieldMultiple from "../../InputFieldMultiple";
import { EntityType, SalesChannelType } from "../../../../api/generated";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";
import { SalesChannelFormValues } from "../../operatorDataUtils";
import SalesChannelDiscountCodeType from "./SalesChannelDiscountCodeType";

type Props = {
  formLens: Lens<SalesChannelFormValues>;
  entityType: EntityType | undefined;
  children?: React.ReactNode;
};

const SalesChannels = ({ formLens, entityType, children }: Props) => {
  const channelType = useWatch(formLens.focus("channelType").interop());
  const allNationalAddresses = useWatch(
    formLens.focus("allNationalAddresses").interop()
  );
  const addresses = useWatch(formLens.focus("addresses").interop());
  const addressesArray = useFieldArray(formLens.focus("addresses").interop());
  const hasOnlineOrBothChannels =
    channelType === "OnlineChannel" || channelType === "BothChannels";
  const hasWebsite =
    hasOnlineOrBothChannels || entityType === EntityType.PublicAdministration;
  return (
    <>
      <SalesChannelDiscountCodeType formLens={formLens} />
      {formLens
        .focus("addresses")
        .defined()
        .map(addressesArray.fields, (_, itemLens, index, array) => (
          <FormSection
            key={index}
            title={index + 1 >= 2 ? `Indirizzo ${index + 1}` : `Indirizzo`}
            description="Inserisci l'indirizzo completo della sede. Servirà agli utenti per usufruire delle opportunità del tuo operatore, se richiedono una sede fisica."
            required={(() => {
              switch (entityType) {
                case EntityType.Private: {
                  if (allNationalAddresses) {
                    return false;
                  }
                  return (
                    channelType === SalesChannelType.OfflineChannel &&
                    index + 1 === 1
                  );
                }
                case EntityType.PublicAdministration: {
                  return channelType === "OfflineChannel";
                }
              }
            })()}
            isVisible
            hasRemove={index !== 0}
            onRemove={() => addressesArray.remove(index)}
          >
            {index === 0 && (
              <ToggleField
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
                  formLens={formLens.focus("allNationalAddresses")}
                  type="checkbox"
                  onClick={() => {
                    addressesArray.remove();
                    addressesArray.append({
                      street: "",
                      zipCode: "",
                      city: "",
                      district: ""
                    });
                  }}
                />
              </ToggleField>
            )}

            <div>
              {allNationalAddresses === false && (
                <>
                  <div className="mt-6 row">
                    <div className="col-6">
                      <InputFieldMultiple htmlFor="street" title="Indirizzo">
                        <Field
                          id="street"
                          formLens={itemLens.focus("street")}
                          type="text"
                          placeholder="Inserisci l'indirizzo"
                          className="form-control"
                        />
                        <FormErrorMessage formLens={itemLens.focus("street")} />
                      </InputFieldMultiple>
                    </div>
                    <div className="col-6">
                      <InputFieldMultiple htmlFor="zipCode" title="CAP">
                        <Field
                          id="zipCode"
                          formLens={itemLens.focus("zipCode")}
                          type="text"
                          placeholder="Inserisci il CAP"
                          className="form-control"
                        />
                        <FormErrorMessage
                          formLens={itemLens.focus("zipCode")}
                        />
                      </InputFieldMultiple>
                    </div>
                  </div>
                  <div className="mt-6 row">
                    <div className="col-6">
                      <InputFieldMultiple htmlFor="city" title="Città">
                        <Field
                          id="city"
                          formLens={itemLens.focus("city")}
                          type="text"
                          placeholder="Inserisci la città"
                          className="form-control"
                        />
                        <FormErrorMessage formLens={itemLens.focus("city")} />
                      </InputFieldMultiple>
                    </div>
                    <div className="col-6">
                      <InputFieldMultiple htmlFor="district" title="Provincia">
                        <Field
                          maxLength={2}
                          id="district"
                          formLens={itemLens.focus("district")}
                          type="text"
                          placeholder="Inserisci la provincia"
                          className="form-control"
                        />
                        <FormErrorMessage
                          formLens={itemLens.focus("district")}
                        />
                      </InputFieldMultiple>
                    </div>
                  </div>
                </>
              )}
              {addresses?.length === index + 1 && (
                <>
                  {allNationalAddresses === false && (
                    <div
                      className="mt-8 cursor-pointer"
                      onClick={() =>
                        addressesArray.append({
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
                  {!hasWebsite && index === array.length - 1 ? children : null}
                </>
              )}
            </div>
          </FormSection>
        ))}
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
            formLens={formLens.focus("websiteUrl")}
            type="text"
            placeholder="Inserisci un sito web (completo di protocollo https)"
            className="form-control"
          />
          <FormErrorMessage formLens={formLens.focus("websiteUrl")} />
          {children}
        </FormSection>
      )}
    </>
  );
};

export default SalesChannels;
