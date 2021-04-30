import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTable, useExpanded } from "react-table";
import { Button, Icon, Badge, Chip, ChipLabel } from "design-react-kit";
import Api from "../../api/backoffice";
import ProfileItem from "../Profile/ProfileItem";
import DocumentIcon from "../../assets/icons/document.svg";
import RequestFilter from "./RequestsFilter";

const Requests = () => {
  const [agreements, setAgreements] = useState<any>([]);

  const getAgreementsApi = async (params?: any) => {
    const response = await Api.Agreement.getAgreements(
      params.states,
      params.assignee,
      params.profileFullName,
      params.requestDateFrom,
      params.requestDateTo,
      params.pageSize,
      params.page
    );
    return response.data.items;
  };

  const getAgreements = (params?: any) => {
    void getAgreementsApi(params).then(response => {
      setAgreements(response);
    });
  };

  const getStateComponent = (state: string) => {
    switch (state) {
      case "PendingAgreement":
        return (
          <Badge
            className="font-weight-normal"
            pill
            tag="span"
            style={{
              backgroundColor: "#EA7614",
              color: "white",
            }}
          >
            In Valutazione
          </Badge>
        );
      case "AssignedAgreement":
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
      case "ApprovedAgreement":
        return (
          <Badge className="font-weight-normal" color="success" pill tag="span">
            Approvato
          </Badge>
        );
      case "RejectedAgreement":
        return (
          <Badge className="font-weight-normal" color="danger" pill tag="span">
            Respinto
          </Badge>
        );
    }
  };

  useEffect(() => {
    getAgreements({});
  }, []);

  const data = useMemo(() => agreements, [agreements]);
  const columns = useMemo(
    () => [
      {
        Header: "Operatore",
        accessor: "profile.fullName"
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
    ({ row: { original } }) => (
      <section className="px-6 py-4 bg-white">
        <h1 className="h5 font-weight-bold text-dark-blue">Dettagli</h1>
        <table className="table">
          <tbody>
            <ProfileItem
              label="Ragione sociale operatore"
              value={original.profile.fullName}
            />
            <ProfileItem
              label="Numero agevolazioni proposte"
              value={original.discounts.length}
            />
            {original.discounts.map((doc: { name: any }, i: number) => (
              <ProfileItem label={`Agevolazione #${i + 1}`} value={doc.name} />
            ))}
          </tbody>
        </table>
        <h1 className="h5 font-weight-bold text-dark-blue">
          Dati del referente incaricato
        </h1>
        <table className="table">
          <tbody>
            <ProfileItem
              label="Nome e cognome"
              value={`${original.profile.referent.firstName} ${original.profile.referent.lastName}`}
            />
            <ProfileItem
              label="Indirizzo e-mail"
              value={original.profile.referent.emailAddress}
            />
            <ProfileItem
              label="Numero di telefono"
              value={original.profile.referent.telephoneNumber}
            />
          </tbody>
        </table>
        <h1 className="h5 font-weight-bold text-dark-blue">Documenti</h1>
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
    [agreements]
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
      <RequestFilter getAgreements={getAgreements} />
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
