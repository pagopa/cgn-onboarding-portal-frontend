import { Badge } from "design-react-kit";
import { DiscountState } from "../../api/generated";

export const DiscountComponent = ({
  discountState
}: {
  discountState: DiscountState;
}) => {
  switch (discountState) {
    case "draft":
      return (
        <Badge
          className="fw-normal"
          pill
          tag="span"
          color="white"
          style={{
            color: "#5C6F82",
            border: "1px solid #5C6F82"
          }}
        >
          Bozza
        </Badge>
      );
    case "published":
      return (
        <Badge className="fw-normal" color="primary" pill tag="span">
          Pubblicata
        </Badge>
      );
    case "suspended":
      return (
        <Badge
          className="fw-normal"
          pill
          tag="span"
          color="#EA7614"
          style={{
            border: "1px solid #EA7614",
            color: "white"
          }}
        >
          Sospesa
        </Badge>
      );
    case "expired":
      return (
        <Badge
          className="fw-normal"
          pill
          tag="span"
          color="white"
          style={{
            border: "1px solid #C02927",
            color: "#C02927"
          }}
        >
          Scaduta
        </Badge>
      );
    case "test_pending":
      return (
        <Badge
          className="fw-normal"
          pill
          tag="span"
          color="white"
          style={{
            border: "1px solid #EA7614",
            color: "#EA7614"
          }}
        >
          In test
        </Badge>
      );
    case "test_failed":
      return (
        <Badge
          className="fw-normal"
          pill
          tag="span"
          color="white"
          style={{
            border: "1px solid #C02927",
            color: "#C02927"
          }}
        >
          Test fallito
        </Badge>
      );
    case "test_passed":
      return (
        <Badge
          className="fw-normal"
          pill
          tag="span"
          color="white"
          style={{
            border: "1px solid #008255",
            color: "#008255"
          }}
        >
          Test superato
        </Badge>
      );
  }
};
