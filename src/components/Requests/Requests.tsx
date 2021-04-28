import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTable, useExpanded } from "react-table";
import { Button, Icon, Badge, Chip, ChipLabel } from "design-react-kit";
import { Link } from "react-router-dom";
import Api from "../../api/index";
import { Discounts } from "../../api/generated";
import ProfileItem from "../Profile/ProfileItem";
import { makeProductCategoriesString } from "../../utils/strings";
import DocumentIcon from "../../assets/icons/document.svg";
import RequestFilter from "./RequestsFilter";

const Requests = () => {
  const [requests, setRequests] = useState<any>([]);
  const { value } = useSelector((state: any) => state.agreement);

  const getRequests = async (agreementId: string) => {
    const response = await Api.Discount.getRequests(agreementId);
    return response.data.items;
  };

  const getStateComponent = (state: string) => {
    switch (state) {
      case "review":
        return (
          <Badge
            className="font-weight-normal"
            pill
            tag="span"
            style={{
              backgroundColor: "#EA7614",
              color: "white",
              border: "1px solid #5C6F82"
            }}
          >
            In Valutazione
          </Badge>
        );

      case "evaluate":
        return (
          <Badge
            className="font-weight-normal"
            style={{
              backgroundColor: "#EA7614",
              color: "#0073E6",
              border: "1px solid #0073E6"
            }}
            pill
            tag="span"
          >
            Da Valutare
          </Badge>
        );
    }
  };

  useEffect(() => {
    void getRequests(value.id).then(response => {
      setRequests(response);
    });
  }, []);

  const data = useMemo(() => requests, [requests]);
  const columns = useMemo(
    () => [
      {
        Header: "Operatore",
        accessor: "operator"
      },
      {
        Header: "Data Richiesta",
        accessor: "requestDate"
      },
      {
        Header: "Stato",
        accessor: "state",
        Cell: ({ row }) => getStateComponent(row.values.state)
      },
      {
        Header: "Revisore",
        accessor: "revisore"
      }
    ],
    []
  );

  const renderRowSubComponent = useCallback(
    ({ row }) => (
      <section className="px-6 py-4 bg-white">
        <h1 className="h4 font-weight-bold text-dark-blue">Dettagli</h1>
        <table className="table">
          <tbody>
            <ProfileItem
              label="Ragione sociale operatore"
              value={row.original.name}
            />
            <ProfileItem
              label="Numero agevolazioni proposte"
              value={row.original.state}
            />
            <ProfileItem
              label="Agevolazione #1"
              value={row.original.startDate}
            />
          </tbody>
        </table>
        <h1 className="h4 font-weight-bold text-dark-blue">
          Dati del referente incaricato
        </h1>
        <table className="table">
          <tbody>
            <ProfileItem label="Nome e cognome" value={row.original.name} />
            <ProfileItem label="Indirizzo e-mail" value={row.original.state} />
            <ProfileItem
              label="Numero di telefono"
              value={row.original.startDate}
            />
          </tbody>
        </table>
        <h1 className="h4 font-weight-bold text-dark-blue">Documenti</h1>
        <div className="border-bottom py-8">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <DocumentIcon className="mr-4" />
              <a href="#">Convenzione</a>
            </div>
            <Button color="primary" icon size="sm" tag="button">
              <Icon
                color="white"
                icon="it-upload"
                padding={false}
                size="xs"
                className="mr-2"
              />
              Carica controfirmato
            </Button>
          </div>
        </div>
        <div className="border-bottom py-8">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <DocumentIcon className="mr-4" />
              <a href="#">Allegato 1 - Manifestazione di interesse</a>
            </div>
            <Button color="primary" icon size="sm" tag="button">
              <Icon
                color="white"
                icon="it-upload"
                padding={false}
                size="xs"
                className="mr-2"
              />
              carica controfirmato
            </Button>
          </div>
        </div>
        <div className="mt-10">
          <Button color="secondary" outline tag="button" className="ml-4">
            Rifiuta
          </Button>
          <Button color="primary" tag="button" className="ml-4">
            Approva
          </Button>
          <Button color="primary" tag="button" className="ml-4">
            Prendi in carica
          </Button>
        </div>
      </section>
    ),
    [requests]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns
  } = useTable({ columns, data }, useExpanded);

  return (
    <section className="mt-2 px-8 py-10 bg-white">
      <RequestFilter />

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
                  {row.cells.map(cell => (
                    <td
                      className="px-6 py-2 border-bottom text-sm"
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
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
    </section>
  );
};

export default Requests;
