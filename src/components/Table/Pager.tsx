import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box } from "@mui/material";

type Props = {
  canPreviousPage: boolean;
  canNextPage: boolean;
  startRowIndex: number;
  endRowIndex: number;
  pageIndex: number;
  total?: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGotoPage: (index: number) => void;
  pageArray: Array<number>;
};

const Pager = (props: Props) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 2
    }}
  >
    {!!props.total && (
      <strong style={{ fontSize: "0.95rem" }}>
        {props.startRowIndex}-{props.endRowIndex} di {props.total}
      </strong>
    )}
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {props.canPreviousPage && (
        <ArrowBackIcon
          onClick={() => props.onPreviousPage()}
          sx={{ cursor: "pointer", mx: 1 }}
        />
      )}
      {props.pageArray.map(page => (
        <Box
          component="span"
          key={page}
          sx={{
            fontWeight: 700,
            mx: 1,
            cursor: page !== props.pageIndex ? "pointer" : "default",
            color: page !== props.pageIndex ? "#0273E6" : "#17324D"
          }}
          onClick={() => {
            if (page !== props.pageIndex) {
              props.onGotoPage(page);
            }
          }}
        >
          {page + 1}
        </Box>
      ))}
      {props.canNextPage && (
        <ArrowForwardIcon
          onClick={() => props.onNextPage()}
          sx={{ cursor: "pointer", mx: 1 }}
        />
      )}
    </Box>
  </Box>
);

export default Pager;
