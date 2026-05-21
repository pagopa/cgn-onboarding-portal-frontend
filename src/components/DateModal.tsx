import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { useState } from "react";

const DateModal = ({
  from: propDateFrom,
  to: propDateTo,
  onSubmit,
  label,
  title
}: {
  from?: Date;
  to?: Date;
  onSubmit(propDateFrom: Date | undefined, propDateTo: Date | undefined): void;
  label: string;
  title: string;
}) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(propDateFrom);
  const [dateTo, setDateTo] = useState<Date | undefined>(propDateTo);
  const [showOpenDateModal, setShowOpenDateModal] = useState(false);

  const toggleDateModal = () => {
    setShowOpenDateModal(!showOpenDateModal);
  };

  const getDateLabel = (
    propDateFrom: Date | undefined,
    propDateTo: Date | undefined
  ): string => {
    if (propDateFrom && propDateTo) {
      return `Dal ${format(propDateFrom, "dd/MM/yyyy")} al ${format(
        propDateTo,
        "dd/MM/yyyy"
      )}`;
    } else if (propDateFrom) {
      return `Dal ${format(propDateFrom, "dd/MM/yyyy")}`;
    } else if (propDateTo) {
      return `Al ${format(propDateTo, "dd/MM/yyyy")}`;
    }
    return label;
  };

  return (
    <>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          padding: "8px 12px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          margin: "8px"
        }}
        onClick={toggleDateModal}
      >
        <span>{getDateLabel(propDateFrom, propDateTo)}</span>
        {(propDateFrom || propDateTo) && (
          <IconButton
            onClick={e => {
              e.stopPropagation();
              onSubmit(undefined, undefined);
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Dialog
        open={showOpenDateModal}
        onClose={toggleDateModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="it-IT"
          >
            <DatePicker
              label="A partire dal giorno"
              value={dateFrom ? dayjs(dateFrom) : null}
              onChange={value => setDateFrom(value?.toDate())}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small"
                }
              }}
            />
            <DatePicker
              label="Fino al giorno"
              value={dateTo ? dayjs(dateTo) : null}
              onChange={value => setDateTo(value?.toDate())}
              minDate={dateFrom ? dayjs(dateFrom) : undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small"
                }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onSubmit(dateFrom, dateTo);
              toggleDateModal();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DateModal;
