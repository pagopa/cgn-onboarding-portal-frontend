import React, { useState } from "react";
import cx from "classnames";
import { Icon } from "design-react-kit";
import { format } from "date-fns";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading";
import {
  ApprovedAgreementDetail,
  ApprovedAgreement
} from "../../api/generated_backoffice";
import { DiscountState } from "../../api/generated";
import Documents from "./Documents";
import Profile from "./Profile";
import Referent from "./Referent";
import OperatorData from "./OperatorData";
import Discount from "./Discount";

const menuLink = (
  view: string,
  setView: (key: string) => void,
  viewKey: string,
  label: string,
  child?: any
) => (
  <li
    className={cx("nav-item", {
      active: view.includes(viewKey)
    })}
  >
    <a
      className={cx("nav-link", {
        active: view.includes(viewKey),
        "cursor-pointer": !child
      })}
      onClick={() => !child && setView(viewKey)}
    >
      <span>{label}</span>
    </a>
    {child}
  </li>
);

export const getBadgeStatus = (state: DiscountState) => {
  switch (state) {
    case "suspended":
      return (
        <span
          className="badge badge-pill badge-outline-warning"
          style={{ fontSize: "12px" }}
        >
          Sospesa
        </span>
      );
    case "test_pending":
      return (
        <span
          className="badge badge-pill badge-outline-warning"
          style={{ fontSize: "12px" }}
        >
          Test
        </span>
      );
    case "test_passed":
      return (
        <span
          className="badge badge-pill badge-outline-success"
          style={{ fontSize: "12px" }}
        >
          Test superato
        </span>
      );
    case "test_failed":
      return (
        <span
          className="badge badge-pill badge-outline-danger"
          style={{ fontSize: "12px" }}
        >
          Test fallito
        </span>
      );
    case "published":
      return (
        <span
          className="badge badge-pill badge-outline-primary"
          style={{ fontSize: "12px" }}
        >
          Pubblicata
        </span>
      );
    default:
      return null;
  }
};

/* eslint-disable sonarjs/cognitive-complexity */
const getView = (
  details: ApprovedAgreementDetail | undefined,
  view: string,
  getConventionDetails: () => void,
  agreement: ApprovedAgreement
) => {
  if (details) {
    if (view.includes("agevolazione")) {
      const discount =
        details?.discounts?.[Number(view.replace(/^\D+/g, "")) - 1];
      if (discount) {
        return (
          <Discount
            reloadDetails={getConventionDetails}
            agreementId={agreement?.agreementId ?? ""}
            discount={discount}
            profile={details.profile}
          />
        );
      } else {
        return (
          <div>
            <h5 className="mb-5 font-weight-bold">Opportunità</h5>
            <p className="text-center text-gray">
              Non è presente nessuna opportunità.
            </p>
          </div>
        );
      }
    }
    switch (view) {
      case "dati_operatore":
        return <OperatorData profile={details.profile} />;
      case "profilo":
        return <Profile profile={details.profile} />;
      case "referente":
        return <Referent referent={details.profile.referent} />;
      case "documenti":
        return <Documents documents={details.documents} />;
    }
  }
};

const ConventionDetails = ({
  agreement,
  onClose
}: {
  agreement: ApprovedAgreement;
  onClose: () => void;
}) => {
  const [view, setView] = useState("dati_operatore");

  const detailsQuery = remoteData.Backoffice.Agreement.getApprovedAgreement.useQuery(
    { agreementId: agreement?.agreementId || "" }
  );
  const details = detailsQuery.data;

  return detailsQuery.isLoading ? (
    <div className="mt-2 px-8 py-10 bg-white">
      <CenteredLoading />
    </div>
  ) : (
    <section>
      <div className="d-flex align-items-center justify-content-between mt-2 px-8 py-10 bg-white">
        <h4>{agreement.fullName}</h4>
        <div>
          <div className="mb-3 text-gray">Data convenzionamento</div>
          <div>
            {format(new Date(agreement.agreementStartDate), "dd/MM/yyyy")}
          </div>
        </div>
        <div>
          <div className="mb-3 text-gray">Data ultima modifica</div>
          <div>
            {format(new Date(agreement.agreementLastUpdateDate), "dd/MM/yyyy")}
          </div>
        </div>
        <div onClick={onClose} className="cursor-pointer">
          <Icon color="primary" icon="it-close" size="" />
        </div>
      </div>
      <div className="d-flex mt-2">
        <div className="col-4 p-0">
          <div className="mr-1 px-8 py-10 bg-white">
            <nav className="navbar it-navscroll-wrapper navbar-expand-lg it-left-side">
              <div className="menu-wrapper">
                <div className="link-list-wrapper">
                  <ul className="link-list">
                    {menuLink(view, setView, "dati_operatore", "Profilo")}
                    {menuLink(
                      view,
                      setView,
                      "agevolazione",
                      "Opportunità",
                      details?.discounts?.length ? (
                        <ul className="link-list">
                          {details?.discounts?.map((d, i: number) => (
                            <li
                              className="nav-link d-flex flex-row align-items-center flex-nowrap"
                              key={i}
                            >
                              <a
                                className={cx(
                                  "nav-link primary-color cursor-pointer",
                                  {
                                    "font-weight-bold": view.includes(
                                      `agevolazione${i + 1}`
                                    )
                                  }
                                )}
                                onClick={() => setView(`agevolazione${i + 1}`)}
                              >
                                {d.name}
                              </a>
                              {getBadgeStatus(d.state)}
                            </li>
                          ))}
                        </ul>
                      ) : null
                    )}
                    {menuLink(view, setView, "profilo", "Dati dell'ente")}
                    {menuLink(view, setView, "referente", "Dati del referente")}
                    {menuLink(view, setView, "documenti", "Documenti")}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className="col-8 p-0">
          <div className="ml-1 px-8 py-10 bg-white">
            {getView(details, view, () => detailsQuery.refetch(), agreement)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConventionDetails;
