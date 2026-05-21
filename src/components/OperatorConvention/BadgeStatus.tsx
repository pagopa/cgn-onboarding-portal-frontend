import { DiscountState } from "../../api/generated";

export const BadgeStatus = ({
  discountState
}: {
  discountState: DiscountState;
}) => {
  switch (discountState) {
    case "suspended":
      return <span style={{ fontSize: "12px" }}>Sospesa</span>;
    case "test_pending":
      return <span style={{ fontSize: "12px" }}>Test</span>;
    case "test_passed":
      return <span style={{ fontSize: "12px" }}>Test superato</span>;
    case "test_failed":
      return <span style={{ fontSize: "12px" }}>Test fallito</span>;
    case "published":
      return <span style={{ fontSize: "12px" }}>Pubblicata</span>;
    default:
      return null;
  }
};
