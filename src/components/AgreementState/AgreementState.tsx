import { Badge } from "design-react-kit";
import { format } from "date-fns";
import Hourglass from "../../assets/icons/hourglass.svg?react";
import { AgreementState as AgreementStateType } from "../../api/generated";
import Check from "../../assets/icons/check.svg?react";

type Props = {
  state: AgreementStateType;
  startDate?: string;
};

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

const AgreementState = ({ state, startDate }: Props) => (
  <section className="bg-white d-flex flex-column align-items-center px-4">
    <h1 className="pt-7 text-base fw-semibold text-dark-blue text-uppercase tracking">
      PagoPA
    </h1>
    <div>
      {state === AgreementStateType.ApprovedAgreement && (
        <Badge className="fw-normal" color="primary" pill tag="span">
          Convenzione attiva
        </Badge>
      )}
      {state === AgreementStateType.PendingAgreement && (
        <Badge
          className="fw-normal"
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
      </div>
    )}
    {state === AgreementStateType.PendingAgreement && (
      <p className="text-sm text-center text-gray">
        La tua richiesta è in attesa di approvazione.
        <br />
        Il referente riceverà una e-mail appena sarà approvata.
      </p>
    )}
  </section>
);

export default AgreementState;
