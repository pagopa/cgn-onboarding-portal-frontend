import React from "react";
import { Icon } from "design-react-kit";
import { Row } from "@tanstack/react-table";

interface ExpanderCellProps<TData> {
  row: Row<TData>;
}

export function ExpanderCell<TData>({ row }: ExpanderCellProps<TData>) {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    row.toggleExpanded();
  };

  return (
    <span role="button" style={{ cursor: "pointer" }} onClick={handleClick}>
      <Icon
        icon={row.getIsExpanded() ? "it-expand" : "it-collapse"}
        color="primary"
      />
    </span>
  );
}
