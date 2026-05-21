import React from "react";
import { Row } from "@tanstack/react-table";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
      {row.getIsExpanded() ? (
        <ExpandLessIcon sx={{ fontSize: "inherit" }} />
      ) : (
        <ExpandMoreIcon sx={{ fontSize: "inherit" }} />
      )}
    </span>
  );
}
