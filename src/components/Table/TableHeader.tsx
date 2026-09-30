import { CSSProperties, JSX } from "react";
import { flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import { Icon, UncontrolledTooltip } from "design-react-kit";

type SortState = "asc" | "desc" | false;

type ColumnMeta = {
  tooltip?: string;
};

const ICON_COLOR = "#5C6F82";

const rowStyle: CSSProperties = {
  backgroundColor: "#FAFAFA",
  borderBottom: `1px solid ${ICON_COLOR}`,
  height: "48px"
};

const contentStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  minWidth: 0
};

const getSortIcon = (sortState: SortState): JSX.Element => {
  if (!sortState) {
    return (
      <Icon icon="it-collapse" style={{ opacity: 0.3, color: ICON_COLOR }} />
    );
  }
  return (
    <Icon
      icon={sortState === "desc" ? "it-expand" : "it-collapse"}
      style={{ color: ICON_COLOR }}
    />
  );
};

function HeaderCell<D extends object>({
  header,
  isFirst,
  isLast
}: {
  header: Header<D, unknown>;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { size, meta } = header.column.columnDef;
  const { tooltip } = (meta as ColumnMeta | undefined) ?? {};
  const canSort = header.column.getCanSort();
  const labelId = `th-${header.id}`;

  const className = [
    isFirst && "ps-6",
    isLast && "pe-6",
    "px-3 py-2 text-gray text-uppercase text-nowrap align-middle",
    canSort && "cursor-pointer"
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <th
      onClick={header.column.getToggleSortingHandler()}
      className={className}
      style={{
        fontSize: "12px",
        fontWeight: 600,
        width: size,
        minWidth: size,
        maxWidth: size
      }}
    >
      <div style={contentStyle}>
        <span id={labelId} style={{ minWidth: 0 }}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>

        {canSort && (
          <span style={{ position: "relative", flexShrink: 0 }}>
            {getSortIcon(header.column.getIsSorted())}
          </span>
        )}
      </div>

      {tooltip && (
        <UncontrolledTooltip
          placement="top"
          flip={false}
          offset={[0, 12]}
          className="th-tooltip"
          target={labelId}
        >
          {tooltip}
        </UncontrolledTooltip>
      )}
    </th>
  );
}

function TableHeader<D extends object>({
  headerGroups
}: {
  headerGroups: Array<HeaderGroup<D>>;
}) {
  return (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id} style={rowStyle}>
          {headerGroup.headers.map((header, j) => (
            <HeaderCell
              key={header.id}
              header={header}
              isFirst={j === 0}
              isLast={j === headerGroup.headers.length - 1}
            />
          ))}
        </tr>
      ))}
    </thead>
  );
}

export default TableHeader;
