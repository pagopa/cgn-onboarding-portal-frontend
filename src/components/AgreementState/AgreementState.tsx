import { ReactNode } from "react";
import { format } from "date-fns";
import Hourglass from "../../assets/icons/hourglass.svg?react";
import Exclamation from "../../assets/icons/exclamation.svg?react";
import { AgreementState as AgreementStateType } from "../../api/generated";
import Check from "../../assets/icons/check.svg?react";
import { BadgePill } from "../BadgePill";

type Props = {
  state: AgreementStateType;
  startDate?: string;
};

type StateMap = Partial<Record<AgreementStateType, ReactNode>>;

const DateLabel = ({
  className = "",
  title,
  date
}: {
  className?: string;
  title: string;
  date: string | undefined;
}) => {
  const newDate = format(new Date(date ?? ""), "dd/MM/yyyy");
  return (
    <div className={`${className} d-flex flex-column text-center`}>
      <span className="text-sm fw-light text-gray">{title}</span>
      <span className="text-sm fw-bold text-black">{newDate}</span>
    </div>
  );
};

const {
  ApprovedAgreement,
  ActiveAgreement,
  PendingAgreement,
  TerminationReminderSentAgreement,
  TerminationInProgressAgreement
} = AgreementStateType;

const AgreementState = ({ state, startDate }: Props) => {
  const activeConventionContent = (
    <>
      <BadgePill label="Convenzione attiva" color="primary" />
      <div className="p-3">
        <Check />
      </div>
      <div
        className="d-flex flex-row justify-content-around pb-10 flex-wrap"
        style={{ width: "100%" }}
      >
        <DateLabel title="Data di inizio" date={startDate} />
      </div>
    </>
  );

  const contentMap: StateMap = {
    [ApprovedAgreement]: activeConventionContent,
    [ActiveAgreement]: activeConventionContent,
    [PendingAgreement]: (
      <>
        <BadgePill label="Richiesta di convenzione inviata" color="warning" />
        <div className="p-3">
          <Hourglass />
        </div>
        <p className="text-sm text-center text-gray">
          La tua richiesta è in attesa di approvazione.
          <br />
          Il referente riceverà una e-mail appena sarà approvata.
        </p>
      </>
    ),
    [TerminationReminderSentAgreement]: (
      <>
        <BadgePill label="Richiamo" color="warning" />
        <div className="p-3">
          <Exclamation />
        </div>
        <p className="text-sm text-center text-gray">
          Hai ricevuto un richiamo di recesso.
        </p>
      </>
    ),
    [TerminationInProgressAgreement]: (
      <>
        <BadgePill label="In recesso" color="danger" />
        <div className="p-3">
          <Exclamation />
        </div>
        <p className="text-sm text-center text-gray">
          Quando la procedura di recesso sarà conclusa, non potrai più accedere
          al Portale operatori.
        </p>
      </>
    )
  };

  return (
    <section className="bg-white d-flex flex-column align-items-center px-4">
      <h1 className="pt-7 text-base fw-semibold text-dark-blue text-uppercase tracking">
        PagoPA
      </h1>
      <div className="d-flex flex-column align-items-center">
        {contentMap[state]}
      </div>
    </section>
  );
};

export default AgreementState;
