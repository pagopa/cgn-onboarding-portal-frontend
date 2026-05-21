import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibleIcon from "../../assets/icons/visible.svg?react";

type Props = {
  hasIntroduction?: boolean;
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  required?: boolean;
  isVisible?: boolean;
  footerDescription?: ReactNode;
  hasClose?: boolean;
  handleClose?(): void;
  hasRemove?: boolean;
  onRemove?(): void;
};

const FormAlertInfoContent = () => (
  <p>
    Le domande contrassegnate con il simbolo * sono obbligatorie
    <br /> Le informazioni contrassegnate con il simbolo <VisibleIcon /> saranno
    visibili in app.
  </p>
);

const FormSection = ({
  hasIntroduction = false,
  title,
  description,
  required = false,
  isVisible = true,
  footerDescription = "",
  children,
  hasClose = false,
  handleClose,
  hasRemove = false,
  onRemove
}: Props) => (
  <Box component="section" sx={{ mt: 2, backgroundColor: "white", p: 2 }}>
    <Box sx={{ position: "relative" }}>
      {hasRemove && (
        <CloseIcon
          sx={{
            cursor: "pointer",
            color: "#0073E5",
            position: "absolute",
            top: "16px",
            right: "16px"
          }}
          onClick={onRemove}
        />
      )}
      <Box>
        {hasIntroduction && (
          <>
            {hasClose && (
              <Box>
                <FormAlertInfoContent />
                <CloseIcon
                  sx={{
                    cursor: "pointer"
                  }}
                  onClick={handleClose}
                />
              </Box>
            )}
            {!hasClose && <FormAlertInfoContent />}
          </>
        )}
        {title && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h5" component="h1">
              {title}
              {required && "*"}
            </Typography>
            {isVisible && <VisibleIcon />}
          </Box>
        )}
        {description && <Typography sx={{ mt: 1 }}>{description}</Typography>}
        {children}
        {footerDescription !== "" && footerDescription}
      </Box>
    </Box>
  </Box>
);

export default FormSection;
