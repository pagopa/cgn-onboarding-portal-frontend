import { useCallback, useEffect } from "react";
import { Lens } from "@hookform/lenses";
import { useController, useWatch } from "react-hook-form";
import { DiscountCodeType, SalesChannelType } from "../../../../api/generated";
import FormSection from "../../FormSection";
import { SalesChannelFormValues } from "../../operatorDataUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

const SalesChannelDiscountCodeType = ({
  formLens
}: {
  formLens: Lens<SalesChannelFormValues>;
}) => {
  const allNationalAddresses = useWatch(
    formLens.focus("allNationalAddresses").interop()
  );
  const addresses = useWatch(formLens.focus("addresses").interop());
  const discountCodeType = useWatch(
    formLens.focus("discountCodeType").interop()
  );
  const salesChannelTypeController = useController(
    formLens.focus("channelType").interop()
  );
  const onChangeSalesChannelType = salesChannelTypeController.field.onChange;
  const updateSalesChannelType = useCallback(
    (cahnnelType: SalesChannelType) => {
      onChangeSalesChannelType({
        target: { value: cahnnelType }
      });
    },
    [onChangeSalesChannelType]
  );

  const thereAreSomeAddresses =
    addresses?.some(
      address =>
        address.street || address.zipCode || address.city || address.district
    ) || allNationalAddresses;

  const chosenChannelType = (() => {
    switch (discountCodeType) {
      case DiscountCodeType.Api:
      case DiscountCodeType.Static:
      case DiscountCodeType.Bucket:
      case DiscountCodeType.LandingPage:
        return SalesChannelType.OnlineChannel;
      default:
        return SalesChannelType.OfflineChannel;
    }
  })();

  // here we are using an effect because there is more code that uses channelType attribute on the form for checks
  // logically channelType is a derived value based on discountCodeType, addresses, allNationalAddresses
  // channelType can be factored out from the form values, but i still needs to be sent to the backend at this point
  useEffect(() => {
    if (
      thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OfflineChannel
    ) {
      updateSalesChannelType(SalesChannelType.OfflineChannel);
    }
    if (
      thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OnlineChannel
    ) {
      updateSalesChannelType(SalesChannelType.BothChannels);
    }
    if (
      !thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OfflineChannel
    ) {
      updateSalesChannelType(SalesChannelType.OfflineChannel);
    }
    if (
      !thereAreSomeAddresses &&
      chosenChannelType === SalesChannelType.OnlineChannel
    ) {
      updateSalesChannelType(SalesChannelType.OnlineChannel);
    }
  }, [chosenChannelType, thereAreSomeAddresses, updateSalesChannelType]);

  return (
    <FormSection
      title={"Gestione delle opportunità per Carta Giovani Nazionale"}
      description={
        <>
          Le modalità possibili sono definite nella&nbsp;
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
            formLens={formLens.focus("discountCodeType")}
            value={DiscountCodeType.Api}
            onClick={() =>
              updateSalesChannelType(SalesChannelType.OnlineChannel)
            }
          />
          <label
            className="text-sm fw-normal text-black form-label"
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
            formLens={formLens.focus("discountCodeType")}
            value={DiscountCodeType.Static}
            onClick={() =>
              updateSalesChannelType(SalesChannelType.OnlineChannel)
            }
          />
          <label
            className="text-sm fw-normal text-black form-label"
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
            formLens={formLens.focus("discountCodeType")}
            value={DiscountCodeType.Bucket}
            onClick={() =>
              updateSalesChannelType(SalesChannelType.OnlineChannel)
            }
          />
          <label
            className="text-sm fw-normal text-black form-label"
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
            formLens={formLens.focus("discountCodeType")}
            value={DiscountCodeType.LandingPage}
            onClick={() =>
              updateSalesChannelType(SalesChannelType.OnlineChannel)
            }
          />
          <label
            className="text-sm fw-normal text-black form-label"
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
            formLens={formLens.focus("discountCodeType")}
            value=""
            onClick={() =>
              updateSalesChannelType(SalesChannelType.OfflineChannel)
            }
          />
          <label
            className="text-sm fw-normal text-black form-label"
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
              : indicherò una sede fisica dove il cittadino potrà usufruire
              dell’opportunità. L’indirizzo è obbligatorio.
            </span>
          </label>
        </div>
        <FormErrorMessage formLens={formLens.focus("discountCodeType")} />
      </div>
    </FormSection>
  );
};

export default SalesChannelDiscountCodeType;
