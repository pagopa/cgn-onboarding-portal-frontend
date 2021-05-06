import React from "react";
import { Badge, Icon } from "design-react-kit";
import Hourglass from "../../assets/icons/hourglass.svg";
import { AgreementState as AgreementStateType } from "../../api/generated";

type Props = {
  state: AgreementStateType;
  startDate: any;
  endDate: any;
};

const Date = ({ title, date }: any) => (
  <div className="d-flex flex-column text-center">
    <span className="text-sm font-weight-light text-gray">{title}</span>
    <span className="text-sm font-weight-bold text-black">{date}</span>
  </div>
);

const AgreementState = ({ state, startDate, endDate }: Props) => (
  <section className="bg-white d-flex flex-column align-items-center">
    <h1 className="pt-7 text-base font-weight-semibold text-dark-blue text-uppercase tracking">
      PagoPA
    </h1>
    <div>
      {state === AgreementStateType.ApprovedAgreement && (
        <Badge className="font-weight-normal" color="success" pill tag="span">
          Convenzione attiva
        </Badge>
      )}
      {state === AgreementStateType.PendingAgreement && (
        <Badge className="font-weight-normal" color="warning" pill tag="span">
          Richiesta di convenzione inviata
        </Badge>
      )}
    </div>
    <div className="p-3">
      {state === AgreementStateType.ApprovedAgreement && (
        <Icon icon="it-check-circle" size="xl" color="success" />
      )}
      {state === AgreementStateType.PendingAgreement && <Hourglass />}
    </div>
    {state === AgreementStateType.ApprovedAgreement && (
      <div className="d-flex flex-row justify-content-between pb-10">
        <Date title="Data di inizio" date={startDate} />
        <Date title="Data di fine" date={endDate} />
      </div>
    )}
    {state === AgreementStateType.PendingAgreement && (
      <p className="text-sm text-center text-gray">
        La votra richiesta è in attesa di approvazione; riceverete una e-mail
        non appena sarà approvata.
      </p>
    )}
  </section>
);

export default AgreementState;
