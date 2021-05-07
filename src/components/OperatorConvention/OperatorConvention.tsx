import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTable } from "react-table";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { identity } from "fp-ts/lib/function";
import { Button } from "design-react-kit";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import {
  ApprovedAgreements,
  ApprovedAgreement
} from "../../api/generated_backoffice";
import ConventionFilter from "./ConventionFilter";
import ConventionDetails from "./ConventionDetails";

const OperatorConvention = () => {
  const [conventions, setConventions] = useState<ApprovedAgreements>();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<
    ApprovedAgreement | undefined
  >();
  const refForm = useRef<any>(null);

  const getConventionsApi = async (params?: any) =>
    await tryCatch(
      () =>
        Api.Agreement.getApprovedAgreements(
          params.profileFullName,
          params.lastUpdateDateFrom,
          params.lastUpdateDateTo,
          params.pageSize,
          params.page
        ),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        response => setConventions(response)
      )
      .run();

  const getConventions = (params?: any) => {
    if (!loading) {
      setLoading(true);
    }
    void getConventionsApi(params);
  };

  useEffect(() => {
    getConventions({});
  }, []);

  const data = useMemo(() => conventions?.items || [], [conventions]);
  const columns = useMemo(
    () => [
      {
        Header: "Operatore",
        accessor: "fullName"
      },
      {
        Header: "Data Convenzionamento",
        accessor: "agreementStartDate"
      },
      {
        Header: "Data Ultima Modifica",
        accessor: "agreementLastUpdateDate"
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable<any>({
    columns,
    data
  });

  if (showDetails && selectedConvention) {
    return (
      <ConventionDetails
        agreement={selectedConvention}
        onClose={() => {
          setShowDetails(false);
          setSelectedConvention(undefined);
        }}
      />
    );
  }

  return (
    <section className="mt-2 px-8 py-10 bg-white">
      <ConventionFilter refForm={refForm} />
      {loading ? (
        <CenteredLoading />
      ) : (
        <>
          <table
            {...getTableProps()}
            style={{ width: "100%" }}
            className="mt-2 bg-white"
          >
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
                      {...column.getHeaderProps()}
                      key={i}
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
                    <tr
                      onClick={() => {
                        setShowDetails(true);
                        setSelectedConvention(row.original);
                      }}
                    >
                      {row.cells.map((cell, i) => (
                        <td
                          className="px-6 py-2 border-bottom text-sm"
                          {...cell.getCellProps()}
                          key={i}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {!conventions?.items.length &&
            (refForm.current?.dirty ? (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessun risultato corrisponde alla tua ricerca</p>
                <Button
                  color="primary"
                  outline
                  tag="button"
                  className="mt-3"
                  onClick={() => refForm.current?.resetForm()}
                >
                  Reimposta Tutto
                </Button>
              </div>
            ) : (
              <div className="m-8 d-flex flex-column align-items-center">
                <p>Nessuna convenzione trovata</p>
              </div>
            ))}
        </>
      )}
    </section>
  );
};

export default OperatorConvention;
