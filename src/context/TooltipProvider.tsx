import { ReactElement, useState, useRef, useCallback, useMemo } from "react";
import { Alert, Box, Typography } from "@mui/material";
import {
  ProviderProps,
  TooltipProviderState,
  initialState,
  TooltipContext
} from "./tooltip";

export function TooltipProvider({
  children
}: Readonly<ProviderProps>): ReactElement {
  const [open, setOpen] = useState(false);
  const [{ severity, text, title }, setTooltip] =
    useState<TooltipProviderState>(initialState);

  const timeoutRef = useRef<number>(null);

  const closeTooltip = (): void => {
    setOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const triggerTooltip = useCallback((tooltip: TooltipProviderState): void => {
    setOpen(true);
    setTooltip(tooltip);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 5000);
  }, []);

  const contextValue = useMemo(() => ({ triggerTooltip }), [triggerTooltip]);

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
      {open && (
        <Box sx={{ position: "fixed", bottom: 0, right: 24 }}>
          <Alert
            severity={severity as "success" | "error" | "warning" | "info"}
            onClose={closeTooltip}
            sx={{ backgroundColor: "white" }}
          >
            {title && (
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            <Typography variant="body2">{text}</Typography>
          </Alert>
        </Box>
      )}
    </TooltipContext.Provider>
  );
}
