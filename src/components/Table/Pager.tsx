import { Icon } from "design-react-kit";

type Props = {
  canPreviousPage: boolean;
  canNextPage: boolean;
  startRowIndex: number;
  endRowIndex: number;
  pageIndex: number;
  total?: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGotoPage: (index: number) => void;
  pageArray: Array<number>;
};

const Pager = (props: Props) => (
  <div className="my-6 d-flex justify-content-between px-3">
    {!!props.total && (
      <span className="fw-semibold">
        {props.startRowIndex}-{props.endRowIndex} di {props.total}
      </span>
    )}
    <div className="d-flex align-items-center">
      {props.canPreviousPage && (
        <Icon
          icon="it-arrow-left"
          size="sm"
          color="primary"
          className="cursor-pointer mx-1"
          onClick={() => props.onPreviousPage()}
        />
      )}
      {props.pageArray.map(page => (
        <div
          className={`fw-semibold mx-1 ${
            page !== props.pageIndex ? "cursor-pointer primary-color" : ""
          }`}
          key={page}
          onClick={() => {
            if (page !== props.pageIndex) {
              props.onGotoPage(page);
            }
          }}
        >
          {page + 1}
        </div>
      ))}
      {props.canNextPage && (
        <Icon
          icon="it-arrow-right"
          size="sm"
          color="primary"
          className="cursor-pointer mx-1"
          onClick={() => props.onNextPage()}
        />
      )}
    </div>
  </div>
);

export default Pager;
