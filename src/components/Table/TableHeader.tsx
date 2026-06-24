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
        <Icon icon="it-collapse" style={{ opacity: 0.3, color: "#5C6F82" }} />
      );
    }
    return (
      <Icon
        icon={sortState === "desc" ? "it-expand" : "it-collapse"}
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
            backgroundColor: "#FAFAFA",
            borderBottom: "1px solid #5C6F82",
            height: "48px"
          }}
        >
          {headerGroup.headers.map((header, j) => (
            <th
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className={`
                ${j === 0 ? "ps-6" : ""}
                ${j === headerGroup.headers.length - 1 ? "pe-6" : ""}
                px-3 py-2 text-gray
                text-uppercase text-nowrap
                align-middle
                ${header.column.getCanSort() ? "cursor-pointer" : ""}
              `}
              style={{ fontSize: "12px", fontWeight: 600 }}
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
