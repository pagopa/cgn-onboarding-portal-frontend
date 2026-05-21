import {
  Button as MuiButton,
  ButtonProps,
  Box,
  CircularProgress
} from "@mui/material";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  loading?: boolean;
  fullWidth?: boolean;
} & Omit<ButtonProps, "fontSize">;

const AsyncButton = ({
  children,
  loading = false,
  fullWidth = false,
  disabled,
  ...rest
}: Props) => {
  const isLoading = loading;
  return (
    <MuiButton
      type="submit"
      variant="contained"
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...rest}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1
        }}
      >
        {isLoading && <CircularProgress size={20} color="inherit" />}
        {children}
      </Box>
    </MuiButton>
  );
};

export default AsyncButton;
