import { Fragment, ReactNode } from "react";
import { flexRender, Row, Table } from "@tanstack/react-table";

type TableBodyProps<TData extends object> = {
  table: Table<TData>;
  renderExpanded?: (row: Row<TData>) => ReactNode;
  onRowClick?: (row: Row<TData>) => void;
};

const expanderCellStyle = { width: "calc(32px + 0.75rem * 2)" };

const cellClassName = (i: number, last: number) =>
  [
    i === 0 && "ps-6",
    i === last && "pe-6",
    "px-3 py-2 border-bottom text-sm align-middle"
  ]
    .filter(Boolean)
    .join(" ");

function TableBody<TData extends object>({
  table,
  renderExpanded,
  onRowClick
}: TableBodyProps<TData>) {
  return (
    <tbody>
      {table.getRowModel().rows.map(row => (
        <Fragment key={row.id}>
          <tr
            className="cursor-pointer"
            style={{ height: "72px" }}
            onClick={() =>
              onRowClick ? onRowClick(row) : row.toggleExpanded()
            }
          >
            {row.getVisibleCells().map((cell, i, arr) => (
              <td
                key={cell.id}
                className={cellClassName(i, arr.length - 1)}
                style={
                  cell.column.id === "expander" ? expanderCellStyle : undefined
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
          {renderExpanded && row.getIsExpanded() && (
            <tr className="px-8 py-4 border-bottom text-sm fw-normal text-black">
              <td colSpan={table.getVisibleLeafColumns().length}>
                {renderExpanded(row)}
              </td>
            </tr>
          )}
        </Fragment>
      ))}
    </tbody>
  );
}

export default TableBody;
