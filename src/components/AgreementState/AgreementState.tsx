import React from "react";
import { Badge } from "design-react-kit";
import { format } from "date-fns";
import Hourglass from "../../assets/icons/hourglass.svg";
import { AgreementState as AgreementStateType } from "../../api/generated";
import Check from "../../assets/icons/check.svg";

type Props = {
  state: AgreementStateType;
  startDate: any;
  endDate: any;
};

const DateLabel = ({ className = "", title, date }: any) => {
  const newDate = format(new Date(date), "dd/MM/yyyy");
  return (
    <div className={`${className} d-flex flex-column text-center`}>
      <span className="text-sm font-weight-light text-gray">{title}</span>
      <span className="text-sm font-weight-bold text-black">{newDate}</span>
    </div>
  );
};

const AgreementState = ({ state, startDate, endDate }: Props) => (
  <section className="bg-white d-flex flex-column align-items-center px-4">
    <h1 className="pt-7 text-base font-weight-semibold text-dark-blue text-uppercase tracking">
      PagoPA
    </h1>
    <div>
      {state === AgreementStateType.ApprovedAgreement && (
        <Badge className="font-weight-normal" color="primary" pill tag="span">
          Convenzione attiva
        </Badge>
      )}
      {state === AgreementStateType.PendingAgreement && (
        <Badge
          className="font-weight-normal"
          pill
          tag="span"
          style={{ backgroundColor: "#EA7614" }}
        >
          Richiesta di convenzione inviata
        </Badge>
      )}
    </div>
    <div className="p-3">
      {state === AgreementStateType.ApprovedAgreement && <Check />}
      {state === AgreementStateType.PendingAgreement && <Hourglass />}
    </div>
    {state === AgreementStateType.ApprovedAgreement && (
      <div
        className="d-flex flex-row justify-content-around pb-10 flex-wrap"
        style={{ width: "100%" }}
      >
        <DateLabel title="Data di inizio" date={startDate} />
        <DateLabel title="Data di fine" date={endDate} />
      </div>
    )}
    {state === AgreementStateType.PendingAgreement && (
      <p className="text-sm text-center text-gray">
        La vostra richiesta è in attesa di approvazione; riceverete una e-mail
        non appena sarà approvata.
      </p>
    )}
  </section>
);

export default AgreementState;
