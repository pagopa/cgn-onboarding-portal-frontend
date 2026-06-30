import { format } from "date-fns";
import { Icon } from "design-react-kit";
import { AgreementState as AgreementStateType } from "../../api/generated";
import { BadgePill, BadgeColor } from "../BadgePill";

type Props = {
  state: AgreementStateType;
  startDate?: string;
};

type DateLabelProps = {
  title: string;
  date: string | undefined;
};

type StateConfig = {
  label: string;
  color: BadgeColor;
  icon: string;
  iconFill: string;
  description?: string;
  showStartDate?: boolean;
};

type StateContentProps = StateConfig & {
  startDate?: string;
};

const {
  ApprovedAgreement,
  ActiveAgreement,
  PendingAgreement,
  InactiveAgreement,
  TerminationReminderSentAgreement,
  TerminationInProgressAgreement
} = AgreementStateType;

const activeConventionConfig: StateConfig = {
  label: "Convenzione attiva",
  color: "primary",
  icon: "it-check-circle",
  iconFill: "#2BD6D0",
  showStartDate: true
};

const configMap: Partial<Record<AgreementStateType, StateConfig>> = {
  [ApprovedAgreement]: activeConventionConfig,
  [ActiveAgreement]: activeConventionConfig,
  [InactiveAgreement]: {
    label: "Inattivo",
    color: "warning",
    icon: "it-warning-circle",
    iconFill: "#2BD6D0",
    showStartDate: true
  },
  [PendingAgreement]: {
    label: "Richiesta di convenzione inviata",
    color: "warning",
    icon: "it-clock",
    iconFill: "#0066CC",
    description:
      "La tua richiesta è in attesa di approvazione. Il referente riceverà una e-mail appena sarà approvata."
  },
  [TerminationReminderSentAgreement]: {
    label: "Richiamo",
    color: "warning",
    icon: "it-warning-circle",
    iconFill: "#2BD6D0",
    description: "Hai ricevuto un richiamo di recesso."
  },
  [TerminationInProgressAgreement]: {
    label: "In recesso",
    color: "danger",
    icon: "it-warning-circle",
    iconFill: "#2BD6D0",
    description:
      "Quando la procedura di recesso sarà conclusa, non potrai più accedere al Portale operatori."
  }
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

const StateContent = ({
  label,
  color,
  icon,
  iconFill,
  description,
  showStartDate,
  startDate
}: StateContentProps) => (
  <>
    <BadgePill label={label} color={color} fullWidth />
    <div className="p-6">
      <Icon icon={icon} style={{ fill: iconFill, width: 95, height: 95 }} />
    </div>
    {showStartDate && (
      <div className="d-flex flex-row justify-content-around flex-wrap w-100">
        <DateLabel title="Data di inizio" date={startDate} />
      </div>
    )}
    {description && (
      <p className="fs-6 text-center text-black m-0 lh-base">{description}</p>
    )}
  </>
);

const AgreementState = ({ state, startDate }: Props) => {
  const config = configMap[state];

  return (
    <section
      className="bg-white d-flex flex-column align-items-center py-6 px-10"
      style={{ width: "292px" }}
    >
      <h1 className="text-base fw-semibold text-dark-blue text-uppercase tracking mb-4">
        PagoPA
      </h1>
      <div className="d-flex flex-column align-items-center w-100">
        {config && <StateContent {...config} startDate={startDate} />}
      </div>
    </section>
  );
};

export default AgreementState;
