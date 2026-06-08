import { Icon } from "design-react-kit";

type Props = {
  canPreviousPage: boolean;
  canNextPage: boolean;
  startRowIndex: number;
  endRowIndex: number;
  pageIndex: number;
  total?: number;
  isPending?: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGotoPage: (index: number) => void;
  pageArray: Array<number>;
};

const Pager = ({
  canPreviousPage,
  canNextPage,
  startRowIndex,
  endRowIndex,
  pageIndex,
  total,
  isPending,
  onPreviousPage,
  onNextPage,
  onGotoPage,
  pageArray
}: Props) => (
  <div
    className="my-6 d-flex justify-content-between px-3"
    style={{ minHeight: "24px" }}
  >
    {!isPending && (
      <>
        {!!total && (
          <span className="fw-semibold">
            {startRowIndex}-{endRowIndex} di {total}
          </span>
        )}
        <div className="d-flex align-items-center">
          {canPreviousPage && (
            <Icon
              icon="it-arrow-left"
              size="sm"
              color="primary"
              className="cursor-pointer mx-1"
              onClick={onPreviousPage}
            />
          )}
          {pageArray.map(page => (
            <div
              className={`fw-semibold mx-1 ${page !== pageIndex ? "cursor-pointer primary-color" : ""}`}
              key={page}
              onClick={() => page !== pageIndex && onGotoPage(page)}
            >
              {page + 1}
            </div>
          ))}
          {canNextPage && (
            <Icon
              icon="it-arrow-right"
              size="sm"
              color="primary"
              className="cursor-pointer mx-1"
              onClick={onNextPage}
            />
          )}
        </div>
      </>
    )}
  </div>
);

export default Pager;
