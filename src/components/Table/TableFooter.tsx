import { Button } from "design-react-kit";
import CenteredLoading from "../CenteredLoading/CenteredLoading";

type Props = {
  isPending: boolean;
  isEmpty: boolean;
  hasActiveFilters: boolean;
  emptyMessage: string;
  onReset: () => void;
};

const TableFooter = ({
  isPending,
  isEmpty,
  hasActiveFilters,
  emptyMessage,
  onReset
}: Props) => {
  if (isPending) {
    return (
      <div className="d-flex align-items-center justify-content-center py-8">
        <CenteredLoading />
      </div>
    );
  }
  if (!isEmpty) {
    return null;
  }
  if (hasActiveFilters) {
    return (
      <div className="m-8 d-flex flex-column align-items-center">
        <p>Nessun risultato corrisponde alla tua ricerca</p>
        <Button
          color="primary"
          outline
          tag="button"
          className="mt-3"
          onClick={onReset}
        >
          Reimposta Tutto
        </Button>
      </div>
    );
  }
  return (
    <div className="m-8 d-flex flex-column align-items-center">
      <p>{emptyMessage}</p>
    </div>
  );
};

export default TableFooter;
