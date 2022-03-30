import { Icon } from "design-react-kit";
import cx from "classnames";
import React from "react";

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
  <div className="mb-2 mt-4 d-flex justify-content-between">
    {!!props.total && (
      <strong>
        {props.startRowIndex}-{props.endRowIndex} di {props.total}
      </strong>
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
          className={cx(
            "font-weight-bold mx-1",
            page !== props.pageIndex ? "cursor-pointer primary-color" : false
          )}
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
