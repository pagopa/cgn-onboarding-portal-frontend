import { useEffect, useState } from "react";
import { Button, FormGroup } from "design-react-kit";
import { Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Lens } from "@hookform/lenses";
import { useController, useWatch } from "react-hook-form";
import FormField from "../../FormField";
import {
  BothChannels,
  OnlineChannel,
  DiscountCodeType,
  Profile,
  SalesChannelType
} from "../../../../api/generated";
import { DiscountFormInputValues } from "../../discountFormUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

type Props = {
  profile: Profile;
  formLens: Lens<DiscountFormInputValues>;
  index?: number;
};

type EycaAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EycaAlertModal = ({ isOpen, onClose }: EycaAlertModalProps) => (
  <Modal isOpen={isOpen} toggle={onClose} size="md">
    <ModalHeader toggle={onClose}>Circuito Eyca</ModalHeader>
    <ModalBody>
      Grazie per la tua scelta! <br />
      Sarai contattato dal Dipartimento per definire i dettagli dell’adesione.
    </ModalBody>
    <ModalFooter className="d-flex flex-column">
      <Button color="primary" onClick={onClose} style={{ width: "100%" }}>
        Ho capito!
      </Button>
    </ModalFooter>
  </Modal>
);

const EnrollToEyca = ({ profile, index, formLens }: Props) => {
  const hasIndex = index !== undefined;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const salesChannel = profile.salesChannel as OnlineChannel | BothChannels;
  const isEycaSupported =
    salesChannel.discountCodeType === DiscountCodeType.Static ||
    salesChannel.discountCodeType === DiscountCodeType.Bucket;
  const discountOption = () => {
    switch (salesChannel.discountCodeType) {
      case DiscountCodeType.LandingPage:
        return "Landing Page";
      case DiscountCodeType.Static:
        return "Codice statico";
      case DiscountCodeType.Bucket:
        return "Lista di codici statici";
      case DiscountCodeType.Api:
        return "API";
    }
  };

  const visibleOnEyca = useWatch(formLens.focus("visibleOnEyca").interop());
  const visibleOnEycaController = useController(
    formLens.focus("visibleOnEyca").interop()
  );
  const visibleOnEycaOnChange = visibleOnEycaController.field.onChange;

  const eycaLandingPageUrl = useWatch(
    formLens.focus("eycaLandingPageUrl").interop()
  );
  const eycaLandingPageUrlController = useController(
    formLens.focus("eycaLandingPageUrl").interop()
  );
  const eycaLandingPageUrlOnChange =
    eycaLandingPageUrlController.field.onChange;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (salesChannel.discountCodeType === DiscountCodeType.LandingPage) {
      visibleOnEycaOnChange({
        target: { value: (eycaLandingPageUrl ?? "").trim() !== "" }
      });
    } else {
      eycaLandingPageUrlOnChange({
        target: { value: "" }
      });
    }
  }, [
    visibleOnEyca,
    eycaLandingPageUrl,
    salesChannel.discountCodeType,
    visibleOnEycaOnChange,
    eycaLandingPageUrlOnChange
  ]);

  if (profile.salesChannel.channelType === SalesChannelType.OfflineChannel) {
    return null;
  }

  if (salesChannel.discountCodeType !== DiscountCodeType.LandingPage) {
    return (
      <>
        <FormField
          htmlFor={hasIndex ? `visibleOnEyca${index}` : "visibleOnEyca"}
          isTitleHeading
          title="Vuoi che questa opportunità sia visibile su EYCA?"
          description={
            isEycaSupported ? (
              <>
                L’opportunità sarà pubblicata anche sul portale del circuito
                EYCA e sarà accessibile da parte dei beneficiari EYCA.
                <br />
                Per maggiori informazioni, consultare la{" "}
                <a
                  className="fw-semibold"
                  href="https://docs.pagopa.it/carta-giovani-nazionale/le-opportunita/riconoscimento-delle-opportunita-ai-titolari-di-eyca"
                  target="_blank"
                  rel="noreferrer"
                >
                  Documentazione tecnica
                </a>
              </>
            ) : (
              <>
                La modalità {discountOption()} non è al momento compatibile con
                EYCA. <br /> Puoi comunque manifestare il tuo interesse ad
                aderire e definire i dettagli con il Dipartimento in un secondo
                momento.
                <br /> Per maggiori informazioni, consultare la{" "}
                <a
                  className="fw-semibold"
                  href="https://docs.pagopa.it/carta-giovani-nazionale"
                  target="_blank"
                  rel="noreferrer"
                >
                  Documentazione tecnica
                </a>
              </>
            )
          }
        >
          <FormGroup check tag="div" className="mt-4">
            <Field
              id={hasIndex ? `visibleOnEyca${index}` : "visibleOnEyca"}
              formLens={formLens.focus("visibleOnEyca")}
              type="checkbox"
              onChangeOverride={(event, onChange) => {
                onChange(event);
                if (isEycaSupported) {
                  if (event.target.checked) {
                    openModal();
                  }
                }
              }}
            />
            <Label
              check
              for={hasIndex ? `visibleOnEyca${index}` : "visibleOnEyca"}
              tag="label"
              className="text-info"
            >
              Sì, voglio che questa opportunità sia valida anche per il circuito
              EYCA
            </Label>
          </FormGroup>
        </FormField>
        <EycaAlertModal isOpen={isModalOpen} onClose={closeModal} />
      </>
    );
  }

  return (
    <FormField
      htmlFor={hasIndex ? `eycaLandingPageUrl${index}` : "eycaLandingPageUrl"}
      isTitleHeading
      title="Vuoi che questa opportunità sia visibile su EYCA?"
      description={
        <>
          Se vuoi che questa opportunità sia visibile anche sul portale di EYCA,
          ti consigliamo di inserire una URL della landing page in inglese da
          cui potranno accedere esclusivamente i beneficiari di EYCA. Per
          maggiori informazioni, consulta la{" "}
          <a
            className="fw-semibold"
            href="https://docs.pagopa.it/carta-giovani-nazionale"
            target="_blank"
            rel="noreferrer"
          >
            Documentazione tecnica
          </a>
          .
        </>
      }
    >
      <FormGroup check tag="div" className="mt-4">
        <Field
          id="eycaLandingPageUrl"
          formLens={formLens.focus("eycaLandingPageUrl")}
          placeholder="Inserisci indirizzo (completo di protocollo http o https)"
          className="form-control"
          type="text"
        />
        <FormErrorMessage formLens={formLens.focus("eycaLandingPageUrl")} />
      </FormGroup>
    </FormField>
  );
};

export default EnrollToEyca;
