import { ReactNode, useMemo, useState } from "react";
import { Icon } from "design-react-kit";
import { format } from "date-fns";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  ApprovedAgreementDetail,
  ApprovedAgreement
} from "../../api/generated_backoffice";
import { BadgePill } from "../BadgePill";
import { discountBadgePill } from "../../utils/badges";
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
  child?: ReactNode
) => {
  const isActive = view.includes(viewKey);
  const stateClass = isActive
    ? "nav-link-active"
    : "border-start border-2 border-white";
  const className = `nav-link p-4 ${stateClass}${child ? "" : " cursor-pointer"}`;

  return (
    <li>
      <a className={className} onClick={() => !child && setView(viewKey)}>
        <span>{label}</span>
      </a>
      {child}
    </li>
  );
};

const getView = (
  details: ApprovedAgreementDetail | undefined,
  view: string,
  getConventionDetails: () => void,
  agreement: ApprovedAgreement
) => {
  if (!details) {
    return null;
  }

  if (view.includes("agevolazione")) {
    const discountIndex = Number(view.replace(/^\D+/g, "")) - 1;
    const discount = details.discounts?.[discountIndex];
    if (!discount) {
      return (
        <div>
          <h5 className="mb-5 fw-bold">Opportunità</h5>
          <p className="text-center text-gray">
            Non è presente nessuna opportunità.
          </p>
        </div>
      );
    }
    return (
      <Discount
        reloadDetails={getConventionDetails}
        agreementId={agreement.agreementId ?? ""}
        discount={discount}
        profile={details.profile}
      />
    );
  }

  switch (view) {
    case "dati_operatore":
      return (
        <OperatorData
          profile={details.profile}
          state={agreement.state}
          partnerName={details.profile.fullName}
          agreementId={details.agreementId}
          reloadDetails={getConventionDetails}
        />
      );
    case "profilo":
      return <Profile profile={details.profile} />;
    case "referente":
      return <Referent referent={details.profile.referent} />;
    case "documenti":
      return <Documents documents={details.documents} />;
  }
};

type ConventionDetailsProps = {
  agreement: ApprovedAgreement;
  onClose: () => void;
};

const ConventionDetails = ({ agreement, onClose }: ConventionDetailsProps) => {
  const [view, setView] = useState("dati_operatore");

  const {
    data: details,
    isPending,
    refetch
  } = remoteData.Backoffice.Agreement.getApprovedAgreement.useQuery({
    agreementId: agreement?.agreementId || ""
  });

  const discountSubmenu = useMemo(() => {
    if (!details?.discounts?.length) {
      return null;
    }
    return (
      <ul className="link-list">
        {details.discounts.map((d, i) => {
          const viewKey = `agevolazione${i + 1}`;
          const isSelected = view.includes(viewKey);
          const linkClass = `nav-link primary-color cursor-pointer${isSelected ? " fw-bold" : ""}`;
          return (
            <li
              key={viewKey}
              className="nav-link d-flex flex-row align-items-center flex-nowrap ps-3"
            >
              <a className={linkClass} onClick={() => setView(viewKey)}>
                {d.name}
              </a>
              <BadgePill {...discountBadgePill[d.state]} />
            </li>
          );
        })}
      </ul>
    );
  }, [details?.discounts, view]);

  if (isPending) {
    return (
      <div className="mt-2 px-8 py-10 bg-white">
        <CenteredLoading />
      </div>
    );
  }

  return (
    <section className="p-0">
      <div className="d-flex align-items-center justify-content-between px-8 py-10 bg-white">
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
      <div className="d-flex flex-column flex-lg-row gap-4 mt-4">
        <div
          className="px-8 py-10 bg-white flex-shrink-0 align-self-lg-start"
          style={{ maxWidth: 400 }}
        >
          <nav className="navbar it-navscroll-wrapper navbar-expand-lg it-left-side p-0">
            <div className="menu-wrapper p-0">
              <div className="link-list-wrapper">
                <ul className="link-list m-0">
                  {menuLink(view, setView, "dati_operatore", "Profilo")}
                  {menuLink(
                    view,
                    setView,
                    "agevolazione",
                    "Opportunità",
                    discountSubmenu
                  )}
                  {menuLink(view, setView, "profilo", "Dati dell'ente")}
                  {menuLink(view, setView, "referente", "Dati del referente")}
                  {menuLink(view, setView, "documenti", "Documenti")}
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="px-8 py-10 bg-white flex-grow-1">
          {getView(details, view, () => refetch(), agreement)}
        </div>
      </div>
    </section>
  );
};

export default ConventionDetails;
