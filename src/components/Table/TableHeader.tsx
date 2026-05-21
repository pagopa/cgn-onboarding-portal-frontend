import { JSX } from "react";
import { flexRender, HeaderGroup } from "@tanstack/react-table";
import { Box, TableCell, TableHead, TableRow } from "@mui/material";
import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";

type SortState = "asc" | "desc" | false;

function TableHeader<D extends object>({
  headerGroups
}: Readonly<{
  headerGroups: Array<HeaderGroup<D>>;
}>) {
  const getSortIcon = (sortState: SortState): JSX.Element => (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        lineHeight: 0.6,
        position: "relative"
      }}
    >
      <ArrowUpIcon
        sx={{
          opacity: sortState ? 1 : 0.3,
          color: "#5C6F82",
          position: "absolute",
          bottom: "-18px",
          fontSize: "16px"
        }}
      />
      <ArrowDownIcon
        sx={{
          opacity: sortState ? 1 : 0.3,
          color: "#5C6F82",
          position: "absolute",
          bottom: "-20px",
          fontSize: "16px"
        }}
      />
    </Box>
  );

  return (
    <TableHead>
      {headerGroups.map(headerGroup => (
        <TableRow
          key={headerGroup.id}
          sx={{
            backgroundColor: "#F8F9F9",
            borderBottom: "1px solid #5A6772"
          }}
        >
          {headerGroup.headers.map((header, j) => (
            <TableCell
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#5C6F82",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
                cursor: header.column.getCanSort() ? "pointer" : "default",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                paddingLeft: j === 0 ? "1.5rem" : "0.75rem",
                paddingRight:
                  j === headerGroup.headers.length - 1 ? "1.5rem" : "0.75rem",
                borderBottom: "none"
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}

              {header.column.getCanSort() && (
                <span style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "-25%"
                    }}
                  >
                    {getSortIcon(header.column.getIsSorted())}
                  </div>
                </span>
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
  );
}

export default TableHeader;
