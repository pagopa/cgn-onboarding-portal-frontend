import React, { useEffect, useState } from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";

type Props = {
  agreementId: string;
  discountId: string;
  isOpen: boolean;
  toggle: () => void;
};

const BucketCodeModal = ({
  isOpen,
  toggle,
  agreementId,
  discountId
}: Props) => {
  const [bucketCode, setBucketCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getBucketCode = async () =>
    await tryCatch(
      () => Api.Discount.getDiscountBucketCode(agreementId, discountId),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setIsLoading(false),
        bucket => {
          setIsLoading(false);
          setBucketCode(bucket.code);
        }
      )
      .run();

  useEffect(() => {
    setIsLoading(true);
    if (isOpen) {
      void getBucketCode();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Codice Sconto dalla lista</ModalHeader>
      <ModalBody>{isLoading ? <CenteredLoading /> : bucketCode}</ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="primary"
          outline
          onClick={toggle}
          style={{
            width: "100%"
          }}
        >
          Chiudi
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BucketCodeModal;
