import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { remoteData } from "../../api/common";
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
  const { data, isLoading, isError } =
    remoteData.Backoffice.Discount.getDiscountBucketCode.useQuery(
      {
        agreementId,
        discountId
      },
      { enabled: isOpen }
    );

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Codice Sconto dalla lista</ModalHeader>
      <ModalBody>
        {(() => {
          if (isLoading) {
            return <CenteredLoading />;
          }
          if (data?.code && !isError) {
            return data.code;
          }
          return "Non è stato possibile caricare il codice";
        })()}
      </ModalBody>
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
