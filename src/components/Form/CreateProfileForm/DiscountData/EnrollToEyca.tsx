import React, { useEffect, useState } from "react";
import { Field } from "formik";
import { Button, FormGroup } from "design-react-kit";
import { Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import FormField from "../../FormField";
import CustomErrorMessage from "../../CustomErrorMessage";
import {
  BothChannels,
  OnlineChannel,
  DiscountCodeType,
  Profile,
  SalesChannelType
} from "../../../../api/generated";

type Props = {
  profile: Profile;
  index?: number;
  formValues?: any;
  setFieldValue?: any;
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

/* eslint-disable sonarjs/cognitive-complexity */
const EnrollToEyca = ({ profile, index, formValues, setFieldValue }: Props) => {
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

  const visibleOnEyca: boolean | undefined = hasIndex
    ? formValues.discounts[index].visibleOnEyca
    : formValues.visibleOnEyca;

  const eycaLandingPageUrl: string | undefined = hasIndex
    ? formValues.discounts[index].eycaLandingPageUrl
    : formValues.eycaLandingPageUrl;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (salesChannel.discountCodeType === DiscountCodeType.LandingPage) {
      setFieldValue(
        hasIndex ? `discounts[${index}].visibleOnEyca` : `visibleOnEyca`,
        (eycaLandingPageUrl ?? "").trim() !== ""
      );
    } else {
      setFieldValue(
        hasIndex
          ? `discounts[${index}].eycaLandingPageUrl`
          : `eycaLandingPageUrl`,
        ""
      );
    }
  }, [
    visibleOnEyca,
    eycaLandingPageUrl,
    salesChannel.discountCodeType,
    setFieldValue,
    hasIndex,
    index
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
                L&apos;opportunità sarà pubblicata anche sul portale del
                circuito EYCA e sarà accessibile da parte dei beneficiari EYCA.{" "}
                <br />
                Per maggiori informazioni, consultare la{" "}
                <a
                  className="font-weight-semibold"
                  href="https://docs.pagopa.it/carta-giovani-nazionale"
                  target="_blank"
                  rel="noreferrer"
                >
                  Documentazione tecnica
                </a>
              </>
            ) : (
              <>
                La modalità {discountOption} non è al momento compatibile con
                EYCA. <br /> Puoi comunque manifestare il tuo interesse ad
                aderire e definire i dettagli con il Dipartimento in un secondo
                momento.
                <br /> Per maggiori informazioni, consultare la{" "}
                <a
                  className="font-weight-semibold"
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
              name={
                hasIndex ? `discounts[${index}].visibleOnEyca` : `visibleOnEyca`
              }
              type="checkbox"
              onChange={(event: { target: { checked: boolean } }) => {
                if (isEycaSupported) {
                  setFieldValue(
                    hasIndex
                      ? `discounts[${index}].visibleOnEyca`
                      : `visibleOnEyca`,
                    event.target.checked
                  );
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
            className="font-weight-semibold"
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
          name={
            hasIndex
              ? `discounts[${index}].eycaLandingPageUrl`
              : "eycaLandingPageUrl"
          }
          placeholder="Inserisci indirizzo (completo di protocollo http o https)"
          type="text"
        />
        <CustomErrorMessage
          name={
            hasIndex
              ? `discounts[${index}].eycaLandingPageUrl`
              : "eycaLandingPageUrl"
          }
        />
      </FormGroup>
    </FormField>
  );
};

export default EnrollToEyca;
