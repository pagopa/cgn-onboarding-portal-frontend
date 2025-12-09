import { JSX } from "react";
import { flexRender, HeaderGroup } from "@tanstack/react-table";
import { Icon } from "design-react-kit";

type SortState = "asc" | "desc" | false;

function TableHeader<D extends object>({
  headerGroups
}: {
  headerGroups: Array<HeaderGroup<D>>;
}) {
  const getSortIcon = (sortState: SortState): JSX.Element => {
    if (!sortState) {
      return (
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            lineHeight: 0.6,
            position: "relative"
          }}
        >
          <Icon
            icon="it-arrow-up-triangle"
            style={{
              opacity: 0.3,
              color: "#5C6F82",
              position: "absolute",
              bottom: "-18px"
            }}
          />
          <Icon
            icon="it-arrow-down-triangle"
            style={{
              opacity: 0.3,
              color: "#5C6F82",
              position: "absolute",
              bottom: "-20px"
            }}
          />
        </div>
      );
    }
    return (
      <Icon
        icon={
          sortState === "desc"
            ? "it-arrow-down-triangle"
            : "it-arrow-up-triangle"
        }
        style={{ color: "#5C6F82" }}
      />
    );
  };

  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr
          key={headerGroup.id}
          style={{
            backgroundColor: "#F8F9F9",
            borderBottom: "1px solid #5A6772"
          }}
        >
          {headerGroup.headers.map((header, j) => (
            <th
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className={`
                ${j === 0 ? "ps-6" : ""}
                ${j === headerGroup.headers.length - 1 ? "pe-6" : ""}
                px-3 py-2 fw-bold text-gray
                text-uppercase text-nowrap
                align-middle
                ${header.column.getCanSort() ? "cursor-pointer" : ""}
              `}
              style={{ fontSize: "0.75rem" }}
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
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

export default TableHeader;
