import { ReactNode, useState } from "react";
import { Icon } from "design-react-kit";
import { format } from "date-fns";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  ApprovedAgreementDetail,
  ApprovedAgreement
} from "../../api/generated_backoffice";
import Documents from "./Documents";
import Profile from "./Profile";
import Referent from "./Referent";
import OperatorData from "./OperatorData";
import Discount from "./Discount";
import { BadgeStatus } from "./BadgeStatus";

const menuLink = (
  view: string,
  setView: (key: string) => void,
  viewKey: string,
  label: string,
  child?: ReactNode
) => (
  <li className={`nav-item ${view.includes(viewKey) ? "active" : ""}`}>
    <a
      className={`nav-link ${view.includes(viewKey) ? "active" : ""} ${!child ? "cursor-pointer" : ""}`}
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
            agreementId={agreement?.agreementId ?? ""}
            discount={discount}
            profile={details.profile}
          />
        );
      } else {
        return (
          <div>
            <h5 className="mb-5 fw-bold">Opportunità</h5>
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

  const {
    data: details,
    isPending: isLoading,
    refetch
  } = remoteData.Backoffice.Agreement.getApprovedAgreement.useQuery({
    agreementId: agreement?.agreementId || ""
  });

  return isLoading ? (
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
          <div className="me-1 px-8 py-10 bg-white">
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
                              className="nav-link d-flex flex-row align-items-center flex-nowrap ps-3"
                              key={i}
                            >
                              <a
                                className={`
                                  nav-link primary-color cursor-pointer ${
                                    view.includes(`agevolazione${i + 1}`)
                                      ? "fw-bold"
                                      : ""
                                  }`}
                                onClick={() => setView(`agevolazione${i + 1}`)}
                              >
                                {d.name}
                              </a>
                              <BadgeStatus discountState={d.state} />
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
          <div className="ms-1 px-8 py-10 bg-white">
            {getView(details, view, () => refetch(), agreement)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConventionDetails;
