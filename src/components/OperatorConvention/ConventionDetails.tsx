import React, { useState, useEffect } from "react";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import cx from "classnames";
import { Icon } from "design-react-kit";
import Api from "../../api/backoffice";
import CenteredLoading from "../CenteredLoading";
import {
  ApprovedAgreementDetail,
  ApprovedAgreement
} from "../../api/generated_backoffice";
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
            agreementId={agreement?.agreementId || ""}
            discount={discount}
          />
        );
      } else {
        return <h6>Nessuna Agevolazione pubblicata</h6>;
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
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ApprovedAgreementDetail>();
  const [view, setView] = useState("dati_operatore");

  const getConventionDetailsApi = async () =>
    await tryCatch(
      () => Api.Agreement.getApprovedAgreement(agreement?.agreementId || ""),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        response => {
          setDetails(response);
          setLoading(false);
        }
      )
      .run();

  const getConventionDetails = () => {
    if (!loading) {
      setLoading(true);
    }
    void getConventionDetailsApi();
  };

  useEffect(() => {
    getConventionDetails();
  }, []);

  return loading ? (
    <div className="mt-2 px-8 py-10 bg-white">
      <CenteredLoading />
    </div>
  ) : (
    <section>
      <div className="d-flex align-items-center justify-content-between mt-2 px-8 py-10 bg-white">
        <h4>{agreement.fullName}</h4>
        <div>
          <div className="mb-3 text-gray">Data convenzionamento</div>
          <div>{agreement.agreementStartDate}</div>
        </div>
        <div>
          <div className="mb-3 text-gray">Data ultima modifica</div>
          <div>{agreement.agreementLastUpdateDate}</div>
        </div>
        <div onClick={onClose} className="cursor-pointer">
          <Icon color="primary" icon="it-close" size="" />
        </div>
      </div>
      <div className="d-flex mt-2">
        <div className="col-4 p-0">
          <div className="mr-1 px-8 py-10 bg-white">
            <nav className="navbar it-navscroll-wrapper navbar-expand-lg it-bottom-navscroll it-left-side">
              <div className="menu-wrapper">
                <div className="link-list-wrapper">
                  <ul className="link-list">
                    {menuLink(
                      view,
                      setView,
                      "dati_operatore",
                      "Dati Operatore"
                    )}
                    {menuLink(
                      view,
                      setView,
                      "agevolazione",
                      "Agevolazioni",
                      details?.discounts?.length ? (
                        <ul className="link-list">
                          {details?.discounts?.map((d, i: number) => (
                            <li className="nav-link" key={i}>
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
                                <span className="d-flex align-items-center">
                                  Agevolazione #{i + 1}
                                  {d.state === "suspended" && (
                                    <span className="dot ml-2 bg-warning" />
                                  )}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null
                    )}
                    {menuLink(view, setView, "profilo", "Profilo")}
                    {menuLink(view, setView, "referente", "Referente")}
                    {menuLink(view, setView, "documenti", "Documenti")}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className="col-8 p-0">
          <div className="ml-1 px-8 py-10 bg-white">
            {getView(details, view, getConventionDetails, agreement)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConventionDetails;
