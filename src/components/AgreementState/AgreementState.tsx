import { ReactNode } from "react";
import { format } from "date-fns";
import { Icon } from "design-react-kit";
import { AgreementState as AgreementStateType } from "../../api/generated";
import { BadgePill } from "../BadgePill";

type Props = {
  state: AgreementStateType;
  startDate?: string;
};

type StateMap = Partial<Record<AgreementStateType, ReactNode>>;

type DateLabelProps = {
  title: string;
  date: string | undefined;
};

const DateLabel = ({ title, date }: DateLabelProps) => {
  const newDate = format(new Date(date ?? ""), "dd/MM/yyyy");
  return (
    <div className="d-flex flex-column text-center gap-2">
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
      <BadgePill label="Convenzione attiva" color="primary" fullWidth />
      <div className="p-6">
        <Icon
          icon="it-check-circle"
          style={{ fill: "#2BD6D0", width: 95, height: 95 }}
        />
      </div>
      <div className="d-flex flex-row justify-content-around flex-wrap w-100">
        <DateLabel title="Data di inizio" date={startDate} />
      </div>
    </>
  );

  const contentMap: StateMap = {
    [ApprovedAgreement]: activeConventionContent,
    [ActiveAgreement]: activeConventionContent,
    [PendingAgreement]: (
      <>
        <BadgePill
          label="Richiesta di convenzione inviata"
          color="warning"
          fullWidth
        />
        <div className="p-6">
          <Icon
            icon="it-clock"
            style={{ fill: "#0066CC", width: 95, height: 95 }}
          />
        </div>
        <p className="fs-6 text-center text-black m-0 lh-base">
          La tua richiesta è in attesa di approvazione. Il referente riceverà
          una e-mail appena sarà approvata.
        </p>
      </>
    ),
    [TerminationReminderSentAgreement]: (
      <>
        <BadgePill label="Richiamo" color="warning" fullWidth />
        <div className="p-6">
          <Icon
            icon="it-warning-circle"
            style={{ fill: "#2BD6D0", width: 95, height: 95 }}
          />
        </div>
        <p className="fs-6 text-center text-black m-0 lh-base">
          Hai ricevuto un richiamo di recesso.
        </p>
      </>
    ),
    [TerminationInProgressAgreement]: (
      <>
        <BadgePill label="In recesso" color="danger" fullWidth />
        <div className="p-6">
          <Icon
            icon="it-warning-circle"
            style={{ fill: "#2BD6D0", width: 95, height: 95 }}
          />
        </div>
        <p className="fs-6 text-center text-black m-0 lh-base">
          Quando la procedura di recesso sarà conclusa, non potrai più accedere
          al Portale operatori.
        </p>
      </>
    )
  };

  return (
    <section
      className="bg-white d-flex flex-column align-items-center py-6 px-10"
      style={{ width: "292px" }}
    >
      <h1 className="text-base fw-semibold text-dark-blue text-uppercase tracking mb-4">
        PagoPA
      </h1>
      <div className="d-flex flex-column align-items-center w-100">
        {contentMap[state]}
      </div>
    </section>
  );
};

export default AgreementState;
