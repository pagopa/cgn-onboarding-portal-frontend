import React, { useState } from "react";
import { Field } from "formik";
import { Button, FormGroup } from "design-react-kit";
import { useSelector } from "react-redux";
import { Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import FormField from "../../FormField";
import { RootState } from "../../../../store/store";
import { EntityType } from "../../../../api/generated";

type Props = {
  isEycaSupported: boolean;
  discountOption: string;
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
const EnrollToEyca = ({
  index,
  formValues,
  setFieldValue,
  isEycaSupported,
  discountOption
}: Props) => {
  const hasIndex = index !== undefined;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkBoxValue, setCheckboxValue] = useState(
    (index !== undefined
      ? formValues.discounts[index].visibleOnEyca
      : formValues.visibleOnEyca) ?? false
  );

  const openModal = (val: any) => {
    setCheckboxValue(val);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFieldValue(
      hasIndex ? `discounts[${index}].visibleOnEyca` : `visibleOnEyca`,
      checkBoxValue
    );
    setIsModalOpen(false);
  };

  const entityType = useSelector(
    (state: RootState) => state.agreement.value.entityType
  );

  return (
    <>
      <FormField
        htmlFor={hasIndex ? `visibleOnEyca${index}` : "visibleOnEyca"}
        isTitleHeading
        title={(() => {
          switch (entityType) {
            case EntityType.Private:
              return `Vuoi che questa agevolazione sia visibile su EYCA?`;
            default:
            case EntityType.PublicAdministration:
              return `Vuoi che questa opportunità sia visibile su EYCA?`;
          }
        })()}
        description={
          isEycaSupported ? (
            <>
              Ti informiamo che se accetti il codice statico sarà pubblicato
              anche sul portale del circuito EYCA. <br />
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
              EYCA. <br /> Puoi comunque manifestare il tuo interesse ad aderire
              e definire i dettagli con il Dipartimento in un secondo momento.
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
            onChange={(e: any) => {
              const value = e.target.value === "true";
              if (isEycaSupported || value) {
                setFieldValue(
                  hasIndex
                    ? `discounts[${index}].visibleOnEyca`
                    : `visibleOnEyca`,
                  !value
                );
                return;
              }
              openModal(!value);
            }}
          />
          <Label
            check
            for={hasIndex ? `visibleOnEyca${index}` : "visibleOnEyca"}
            tag="label"
          >
            {(() => {
              switch (entityType) {
                case EntityType.Private:
                  return (
                    <>
                      Sì, voglio che questa agevolazione sia valida anche per il
                      circuito EYCA
                    </>
                  );
                default:
                case EntityType.PublicAdministration:
                  return (
                    <>
                      Sì, voglio che questa opportunità sia valida anche per il
                      circuito EYCA
                    </>
                  );
              }
            })()}
          </Label>
        </FormGroup>
      </FormField>
      <EycaAlertModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default EnrollToEyca;
