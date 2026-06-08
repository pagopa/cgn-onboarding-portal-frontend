import { DiscountState } from "../../api/generated";
import { StateBadge } from "../StateBadge";

type BadgeStatusProps = {
  discountState: DiscountState;
};

export const BadgeStatus = ({ discountState }: BadgeStatusProps) => {
  switch (discountState) {
    case DiscountState.Suspended:
      return <StateBadge color="warning">Sospesa</StateBadge>;
    case DiscountState.TestPending:
      return <StateBadge color="warning">Test</StateBadge>;
    case DiscountState.TestPassed:
      return <StateBadge color="success">Test superato</StateBadge>;
    case DiscountState.TestFailed:
      return <StateBadge color="danger">Test fallito</StateBadge>;
    case DiscountState.Published:
      return <StateBadge color="primary">Pubblicata</StateBadge>;
    case DiscountState.Expired:
      return <StateBadge color="secondary">Scaduta</StateBadge>;
    default:
      return null;
  }
};
