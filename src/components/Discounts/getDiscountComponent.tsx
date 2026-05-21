import { Chip } from "@mui/material";
import { DiscountState } from "../../api/generated";

export const DiscountComponent = ({
  discountState
}: {
  discountState: DiscountState;
}) => {
  switch (discountState) {
    case "draft":
      return (
        <Chip
          label="Bozza"
          size="small"
          sx={{
            color: "#5C6F82",
            border: "1px solid #5C6F82",
            backgroundColor: "white"
          }}
          variant="outlined"
        />
      );
    case "published":
      return <Chip label="Pubblicata" color="primary" size="small" />;
    case "suspended":
      return (
        <Chip
          label="Sospesa"
          size="small"
          sx={{
            border: "1px solid #EA7614",
            color: "#EA7614",
            backgroundColor: "white"
          }}
          variant="outlined"
        />
      );
    case "expired":
      return (
        <Chip
          label="Scaduta"
          size="small"
          sx={{
            border: "1px solid #C02927",
            color: "#C02927",
            backgroundColor: "white"
          }}
          variant="outlined"
        />
      );
    case "test_pending":
      return (
        <Chip
          label="In test"
          size="small"
          sx={{
            border: "1px solid #EA7614",
            color: "#EA7614",
            backgroundColor: "white"
          }}
          variant="outlined"
        />
      );
    case "test_failed":
      return (
        <Chip
          label="Test fallito"
          size="small"
          sx={{
            border: "1px solid #C02927",
            color: "#C02927",
            backgroundColor: "white"
          }}
          variant="outlined"
        />
      );
    case "test_passed":
      return (
        <Chip
          label="Test superato"
          size="small"
          sx={{
            border: "1px solid #008255",
            color: "#008255",
            backgroundColor: "white"
          }}
          variant="outlined"
        />
      );
  }
};
