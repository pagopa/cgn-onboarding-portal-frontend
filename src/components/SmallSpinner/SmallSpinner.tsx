import { CircularProgress, Box } from "@mui/material";

const SmallSpinner = () => (
  <Box sx={{ mr: 1 }}>
    <CircularProgress size={20} />
  </Box>
);

export default SmallSpinner;
