import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import VisibleIcon from "../../assets/icons/visible.svg?react";

type Props = {
  htmlFor: string;
  isTitleHeading?: boolean;
  title?: string;
  description?: string | React.ReactElement;
  children: ReactNode;
  required?: boolean;
  isVisible?: boolean;
};

const FormField = ({
  htmlFor,
  isTitleHeading = false,
  title,
  description,
  children,
  required = false,
  isVisible = false
}: Props) => (
  <Box sx={{ mt: isTitleHeading ? 5 : 3 }}>
    <Box>
      <label htmlFor={htmlFor}>
        <Box
          component="span"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Typography
            component="span"
            variant={isTitleHeading ? "h5" : "body1"}
            sx={{ fontWeight: 700, color: "#01254C" }}
          >
            {title}
            {required && "*"}
          </Typography>
          {isVisible && (
            <Box component="span" sx={{ display: "inline-flex" }}>
              <VisibleIcon />
            </Box>
          )}
        </Box>

        {description && (
          <Typography variant="body2" sx={{ mt: 1, color: "#5C6F82" }}>
            {description}
          </Typography>
        )}
      </label>
      {children}
    </Box>
  </Box>
);

export default FormField;
