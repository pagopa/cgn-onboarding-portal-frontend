import React from "react";
import { Field, useFormikContext } from "formik";
import { InferType } from "yup";
import CustomErrorMessage from "../../CustomErrorMessage";
import FormSection from "../../FormSection";
import {
  DiscountCodeType,
  EntityType,
  SalesChannelType
} from "../../../../api/generated";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";

const SalesChannelDiscountCodeType = ({
  entityType
}: {
  entityType: EntityType | undefined;
}) => {
  type Values = InferType<typeof ProfileDataValidationSchema>;
  const formikContext = useFormikContext<Values>();
  const formValues = formikContext.values;
  const formikContextSetFieldValue = formikContext.setFieldValue;
  const updateSalesChannelType = (channelType: SalesChannelType) => () => {
    formikContext.setFieldValue("salesChannel.channelType", channelType);
  };
  // here we are using an effect because there is more code that uses channelType attribute on the form for checks
  // logically channelType is a derived value based on discountCodeType, addresses, allNationalAddresses
  // channelType can be factored out from the form values, but i still needs to be sent to the backend at this point
  React.useEffect(() => {
    const thereAreSomeAddresses =
      formValues.salesChannel.addresses?.some(
        address =>
          address.street || address.zipCode || address.city || address.district
      ) || formValues.salesChannel?.allNationalAddresses;
    const chosenChannelType = (() => {
      switch (formValues.salesChannel.discountCodeType) {
        case DiscountCodeType.Api:
        case DiscountCodeType.Static:
        case DiscountCodeType.Bucket:
        case DiscountCodeType.LandingPage:
          return SalesChannelType.OnlineChannel;
        default:
          return SalesChannelType.OfflineChannel;
      }
    })();
    if (
      thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OfflineChannel
    ) {
      formikContextSetFieldValue(
        "salesChannel.channelType",
        SalesChannelType.OfflineChannel
      );
    }
    if (
      thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OnlineChannel
    ) {
      formikContextSetFieldValue(
        "salesChannel.channelType",
        SalesChannelType.BothChannels
      );
    }
    if (
      !thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OfflineChannel
    ) {
      formikContextSetFieldValue(
        "salesChannel.channelType",
        SalesChannelType.OfflineChannel
      );
    }
    if (
      !thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OnlineChannel
    ) {
      formikContextSetFieldValue(
        "salesChannel.channelType",
        SalesChannelType.OnlineChannel
      );
    }
  }, [formValues, formikContextSetFieldValue]);
  return (
    <FormSection
      title={"Gestione delle opportunità per Carta Giovani Nazionale"}
      description={
        <>
          Le modalità possibili sono definite nella
          <a
            className="font-weight-semibold"
            href="https://docs.pagopa.it/carta-giovani-nazionale"
            target="_blank"
            rel="noreferrer"
          >
            Documentazione Tecnica
          </a>
          . Seleziona la modalità principale:
        </>
      }
      required
      isVisible={false}
    >
      <div className="d-flex flex-column">
        <div className="form-check">
          <Field
            id="api"
            type="radio"
            name="salesChannel.discountCodeType"
            value={DiscountCodeType.Api}
            onClick={updateSalesChannelType(SalesChannelType.OnlineChannel)}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="api"
          >
            <span className="text-sm">
              <a
                href="https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/le-opportunita/le-modalita-di-riconoscimento-e-validazione-delle-opportunita/modalita-api"
                target="_blank"
                rel="noreferrer"
              >
                API
              </a>
              : implementerò sul mio portale di e-commerce le integrazioni
              tecniche necessarie a validare i codici inseriti dai beneficiari,
              chiamando le API messe a disposizione da PagoPA per verificare la
              validità dei codici in tempo reale. L’indirizzo è facoltativo.
            </span>
          </label>
        </div>
        <div className="form-check">
          <Field
            id="staticCode"
            type="radio"
            name="salesChannel.discountCodeType"
            value={DiscountCodeType.Static}
            onClick={updateSalesChannelType(SalesChannelType.OnlineChannel)}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="staticCode"
          >
            <span className="text-sm">
              <a
                href="https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/le-opportunita/le-modalita-di-riconoscimento-e-validazione-delle-opportunita/modalita-codice-sconto-statico"
                target="_blank"
                rel="noreferrer"
              >
                Con codice statico
              </a>
              : assocerò ad ogni opportunità un codice statico che verrà letto e
              accettato dai miei sistemi. L’indirizzo è facoltativo.
            </span>
          </label>
        </div>
        <div className="form-check">
          <Field
            id="bucket"
            type="radio"
            name="salesChannel.discountCodeType"
            value={DiscountCodeType.Bucket}
            onClick={updateSalesChannelType(SalesChannelType.OnlineChannel)}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="bucket"
          >
            <span className="text-sm">
              <a
                href="https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/le-opportunita/le-modalita-di-riconoscimento-e-validazione-delle-opportunita/modalita-lista-di-codici-statici"
                target="_blank"
                rel="noreferrer"
              >
                Con lista di codici statici
              </a>
              : assocerò ad ogni opportunità una lista di codici statici che
              verranno letti e accettati dai miei sistemi e che mi impegno a
              caricare periodicamente, consapevole del fatto che, se si
              esaurissero, l’opportunità sarebbe sospesa. L’indirizzo è
              facoltativo.
            </span>
          </label>
        </div>
        <div className="form-check">
          <Field
            id="landingPage"
            type="radio"
            name="salesChannel.discountCodeType"
            value={DiscountCodeType.LandingPage}
            onClick={updateSalesChannelType(SalesChannelType.OnlineChannel)}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="landingPage"
          >
            <span className="text-sm">
              <a
                href="https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/le-opportunita/le-modalita-di-riconoscimento-e-validazione-delle-opportunita/modalita-landing-page"
                target="_blank"
                rel="noreferrer"
              >
                Con link a landing page
              </a>
              : fornirò per ogni opportunità un link con cui il cittadino che
              accede proveniendo da IO potrà usufruire degli sconti. L’indirizzo
              è facoltativo.
            </span>
          </label>
        </div>
        <div className="form-check">
          <Field
            id="physcalPlace"
            type="radio"
            name="salesChannel.discountCodeType"
            value=""
            onClick={updateSalesChannelType(SalesChannelType.OfflineChannel)}
          />
          <label
            className="text-sm font-weight-normal text-black"
            htmlFor="physcalPlace"
          >
            <span className="text-sm">
              <a
                href="https://developer.pagopa.it/app-io/guides/carta-giovani-nazionale/le-opportunita/le-modalita-di-riconoscimento-e-validazione-delle-opportunita/presenza-fisica-del-beneficiario"
                target="_blank"
                rel="noreferrer"
              >
                Sede fisica
              </a>
              {(() => {
                switch (entityType) {
                  default:
                  case EntityType.PublicAdministration:
                    return (
                      <>
                        : indicherò una sede fisica dove il cittadino potrà
                        usufruire dell’opportunità. L’indirizzo è obbligatorio.
                      </>
                    );
                }
              })()}
            </span>
          </label>
        </div>
        <CustomErrorMessage name={`salesChannel.discountCodeType`} />
      </div>
    </FormSection>
  );
};

export default SalesChannelDiscountCodeType;
