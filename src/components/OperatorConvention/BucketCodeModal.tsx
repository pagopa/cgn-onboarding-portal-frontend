import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
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
  const { data, isPending, isError, error } =
    remoteData.Backoffice.Discount.getDiscountBucketCode.useQuery(
      {
        agreementId,
        discountId
      },
      { enabled: isOpen, retry: false }
    );

  const renderContent = () => {
    if (isPending) {
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
    <Dialog open={isOpen} onClose={toggle} maxWidth="sm" fullWidth>
      <DialogTitle>Codice Sconto dalla lista</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
        <Button
          color="primary"
          variant="outlined"
          onClick={toggle}
          style={{
            width: "100%"
          }}
        >
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BucketCodeModal;
