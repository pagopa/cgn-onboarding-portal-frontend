import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";

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
  const { data, isLoading, isError, error } =
    remoteData.Backoffice.Discount.getDiscountBucketCode.useQuery(
      {
        agreementId,
        discountId
      },
      { enabled: isOpen, retry: false }
    );

  const renderContent = () => {
    if (isLoading) {
      return <CenteredLoading />;
    }
    if (data?.code && !isError) {
      return data.code;
    }
    if (
      error?.status === 400 &&
      error.response?.data ===
        "CANNOT_RETRIEVE_BUCKET_CODE_FROM_DISCOUNT_WITH_EMPTY_BUCKET"
    ) {
      return "I codici sconto disponibili sono terminati. L’operatore deve caricare una nuova lista di codici per poter procedere.";
    }
    return "Non è stato possibile caricare il codice";
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Codice Sconto dalla lista</ModalHeader>
      <ModalBody>{renderContent()}</ModalBody>
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
