import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTable, useExpanded } from "react-table";
import Api from "../../api/index";
import { Discounts } from "../../api/generated";
import { Button, Icon } from "design-react-kit";
import { Link } from "react-router-dom";
import {
  CREATE_DISCOUNT,
  DASHBOARD,
  EDIT_PROFILE
} from "../../navigation/routes";
import { useHistory } from "react-router-dom";
import ProfileItem from "../Profile/ProfileItem";
import { makeProductCategoriesString } from "../../utils/strings";
import { Badge } from "design-react-kit";

const OperatorConvention = () => {
  const history = useHistory();
  const [discounts, setDiscounts] = useState<any>([]);
  const { value } = useSelector((state: any) => state.agreement);

  const getDiscounts = async (agreementId: string) => {
    const response = await Api.Discount.getDiscounts(agreementId);
    return response.data.items;
  };

  const getDiscountComponent = (state: string) => {
    switch (state) {
      case "draft":
        return (
          <Badge
            className="font-weight-normal"
            pill
            tag="span"
            style={{
              backgroundColor: "white",
              color: "#5C6F82",
              border: "1px solid #5C6F82"
            }}
          >
            Bozza
          </Badge>
        );

      case "published":
        return (
          <Badge className="font-weight-normal" color="primary" pill tag="span">
            Pubblicata
          </Badge>
        );

      case "rejected":
        return (
          <Badge
            className="font-weight-normal"
            pill
            tag="span"
            style={{
              backgroundColor: "white",
              border: "1px solid #C02927",
              color: "#C02927"
            }}
          >
            Sospesa
          </Badge>
        );
    }
  };

  const getVisibleComponent = (isVisible: boolean) => {
    if (isVisible) {
      return (
        <span>
          <Icon icon="it-password-visible" />
          <span className="text-base font-weight-normal text-gray">SI</span>
        </span>
      );
    } else {
      return (
        <span>
          <Icon icon="it-password-invisible" />
          <span className="text-base font-weight-normal text-gray">NO</span>
        </span>
      );
    }
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
        accessor: "state",
        Cell: ({ row }) => getDiscountComponent(row.values.state)
      },
      {
        Header: "Visibile",
        Cell: ({ row }) => getVisibleComponent(row.values.state === "published")
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

  const renderRowSubComponent = useCallback(
    ({ row }) => {
      return (
        <section className="px-6 py-4 bg-white">
          <h1 className="h4 font-weight-bold text-dark-blue">Dettagli</h1>
          <table className="table">
            <tbody>
              <ProfileItem
                label="Nome agevolazione"
                value={row.original.name}
              />
              {row.original.description && (
                <ProfileItem
                  label="Descrizione agevolazione"
                  value={row.original.description}
                />
              )}
              <ProfileItem
                label="Stato agevolazione"
                value={row.original.state}
              />
              <ProfileItem
                label="Data di inizio dell'agevolazione"
                value={row.original.startDate}
              />
              <ProfileItem
                label="Data di fine agevolazione"
                value={row.original.endDate}
              />
              <ProfileItem
                label="Entità dello sconto"
                value={`${row.original.discount}%`}
              />
              <ProfileItem
                label="Categorie merceologiche"
                value={makeProductCategoriesString(
                  row.original.productCategories
                )}
              />
              {row.original.conditions && (
                <ProfileItem
                  label="Condizioni dell’agevolazione"
                  value={row.original.conditions}
                />
              )}
            </tbody>
          </table>
          <div className="mt-10">
            <Link
              to={{
                pathname: EDIT_PROFILE,
                state: { signupCompleted: true }
              }}
            >
              Modifica
            </Link>

            <Button color="primary" icon tag="button" className="ml-4">
              <Icon icon="it-delete" color="white" padding={false} size="" />{" "}
              Elimina
            </Button>
          </div>
        </section>
      );
    },
    [discounts]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ columns, data }, useExpanded);

  return (
    <div>
      <table
        {...getTableProps()}
        style={{ width: "100%" }}
        className="mt-2 bg-white"
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{
                backgroundColor: "#F8F9F9",
                borderBottom: "1px solid #5A6772"
              }}
            >
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-2 text-sm font-weight-bold text-gray text-uppercase"
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
              <React.Fragment key={row.getRowProps().key}>
                <tr>
                  {row.cells.map(cell => {
                    return (
                      <td
                        className="px-6 py-2 border-bottom text-sm"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr className="px-8 py-4 border-bottom text-sm font-weight-normal text-black">
                    <td colSpan={visibleColumns.length}>
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
    </div>
  );
};

export default OperatorConvention;
