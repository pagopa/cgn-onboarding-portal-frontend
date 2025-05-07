import { Icon } from "design-react-kit";
import { HeaderGroup } from "react-table";

type Props = {
  headerGroups: Array<HeaderGroup<any>>;
};

const TableHeader = ({ headerGroups }: Props) => (
  <thead>
    {headerGroups.map((headerGroup, i) => (
      <tr
        {...headerGroup.getHeaderGroupProps()}
        key={i}
        style={{
          backgroundColor: "#F8F9F9",
          borderBottom: "1px solid #5A6772"
        }}
      >
        {headerGroup.headers.map((column, i) => (
          <th
            {...column.getHeaderProps(column.getSortByToggleProps())}
            key={i}
            className={`
              ${i === 0 ? "ps-6" : ""}
              ${i === headerGroup.headers.length - 1 ? "pe-6" : ""}
              px-3 py-2 fw-bold text-gray
              text-uppercase text-nowrap
            `}
            style={{ fontSize: "0.75rem", verticalAlign: "middle" }}
          >
            {column.render("Header")}
            <span style={{ position: "relative" }}>
              {column.canSort && (
                <div
                  style={{ position: "absolute", left: "100%", top: "-25%" }}
                >
                  {column.isSorted ? (
                    <>
                      {column.isSortedDesc ? (
                        <Icon
                          icon="it-arrow-up-triangle"
                          style={{
                            color: "#5C6F82"
                          }}
                        />
                      ) : (
                        <Icon
                          icon="it-arrow-down-triangle"
                          style={{
                            color: "#5C6F82"
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <Icon
                      icon="it-arrow-up-triangle"
                      style={{
                        color: "#5C6F82"
                      }}
                    />
                  )}
                </div>
              )}
            </span>
          </th>
        ))}
      </tr>
    ))}
  </thead>
);

export default TableHeader;
