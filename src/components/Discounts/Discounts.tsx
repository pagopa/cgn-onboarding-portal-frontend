import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTable, useExpanded } from "react-table";
import Api from "../../api/index";
import { Discounts } from "../../api/generated";
import { Icon } from "design-react-kit";
import { Link } from "react-router-dom";
import { CREATE_DISCOUNT, DASHBOARD } from "../../navigation/routes";
import { useHistory } from "react-router-dom":

const Discounts = () => {
  const history = useHistory();
  const [discounts, setDiscounts] = useState<any>([]);
  const { value } = useSelector((state: any) => state.agreement);

  const getDiscounts = async (agreementId: string) => {
    const response = await Api.Discount.getDiscounts(agreementId);
    return response.data.items;
  };

  useEffect(() => {
    void getDiscounts(value.id).then(response => {
      setDiscounts(response);
      history.push(DASHBOARD);
    });
  }, []);

  const data = useMemo(() => discounts, [discounts]);
  const columns = useMemo(
    () => [
      {
        Header: "Nome agevolazione",
        accessor: "name"
      },
      {
        Header: "Aggiunta il",
        accessor: "startDate"
      },
      {
        Header: "Stato",
        accessor: "state"
      },
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <Icon icon="it-expand" color="primary" />
            ) : (
              <Icon icon="it-collapse" color="primary" />
            )}
          </span>
        )
      }
    ],
    []
  );

  const renderRowSubComponent = useCallback(({ row }) => {
    if (discounts !== []) console.log(discounts);
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded }
  } = useTable({ columns, data }, useExpanded);

  return (
    <>
      <table
        {...getTableProps()}
        style={{ width: "100%" }}
        className="mt-2 bg-white"
      >
        <thead>
          {headerGroups.map(headerGroup => (
            // eslint-disable-next-line react/jsx-key
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{
                backgroundColor: "#F8F9F9",
                borderBottom: "1px solid #5A6772"
              }}
            >
              {headerGroup.headers.map(column => (
                // eslint-disable-next-line react/jsx-key
                <th
                  {...column.getHeaderProps()}
                  className="px-8 py-2 text-sm font-weight-bold text-gray text-uppercase"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <React.Fragment {...row.getRowProps()}>
                <tr>
                  {row.cells.map(cell => {
                    return (
                      <td className="px-8 py-2" {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded ? (
                  <tr className="px-8 py-4 border-bottom text-base font-weight-normal text-black">
                    <td colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="bg-white px-8 pt-10 pb-10">
        <Link to={CREATE_DISCOUNT} className="btn btn-outline-primary">
          Nuova agevolazione
        </Link>
      </div>
    </>
  );
};

export default Discounts;
