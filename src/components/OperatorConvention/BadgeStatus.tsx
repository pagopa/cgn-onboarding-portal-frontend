import { DiscountState } from "../../api/generated";

export const BadgeStatus = ({
  discountState
}: {
  discountState: DiscountState;
}) => {
  switch (discountState) {
    case "suspended":
      return (
        <span
          className="badge rounded-pill badge-outline-warning"
          style={{ fontSize: "12px" }}
        >
          Sospesa
        </span>
      );
    case "test_pending":
      return (
        <span
          className="badge rounded-pill badge-outline-warning"
          style={{ fontSize: "12px" }}
        >
          Test
        </span>
      );
    case "test_passed":
      return (
        <span
          className="badge rounded-pill badge-outline-success"
          style={{ fontSize: "12px" }}
        >
          Test superato
        </span>
      );
    case "test_failed":
      return (
        <span
          className="badge rounded-pill badge-outline-danger"
          style={{ fontSize: "12px" }}
        >
          Test fallito
        </span>
      );
    case "published":
      return (
        <span
          className="badge rounded-pill badge-outline-primary"
          style={{ fontSize: "12px" }}
        >
          Pubblicata
        </span>
      );
    default:
      return null;
  }
};
