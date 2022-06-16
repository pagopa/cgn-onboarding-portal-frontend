import { Button } from "design-react-kit";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
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

  const getBucketCode = () =>
    pipe(
      TE.tryCatch(
        () => Api.Discount.getDiscountBucketCode(agreementId, discountId),
        toError
      ),
      TE.map(response => response.data),
      TE.mapLeft(() => setIsLoading(false)),
      TE.map(bucket => {
        setIsLoading(false);
        setBucketCode(bucket.code);
      })
    )();

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
