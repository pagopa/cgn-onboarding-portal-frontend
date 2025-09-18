import { ReactElement, useState, useRef, useCallback, useMemo } from "react";
import { Alert } from "reactstrap";
import {
  ProviderProps,
  TooltipProviderState,
  initialState,
  TooltipContext
} from "./tooltip";

export function TooltipProvider({ children }: ProviderProps): ReactElement {
  const [open, openTooltip] = useState(false);
  const [{ severity, text, title }, setTooltip] =
    useState<TooltipProviderState>(initialState);

  const timeoutRef = useRef<number>(null);

  const closeTooltip = (): void => {
    openTooltip(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const triggerTooltip = useCallback((tooltip: TooltipProviderState): void => {
    openTooltip(true);
    setTooltip(tooltip);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      openTooltip(false);
    }, 5000);
  }, []);

  const contextValue = useMemo(() => ({ triggerTooltip }), [triggerTooltip]);

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
      {open && (
        <div className="fixed-bottom me-6" style={{ left: "auto" }}>
          <Alert color={severity} fade isOpen={open} toggle={closeTooltip}>
            {title && (
              <h4 className="alert-heading" style={{ marginTop: "-4px" }}>
                {title}
              </h4>
            )}
            <span className="pe-4">{text}</span>
          </Alert>
        </div>
      )}
    </TooltipContext.Provider>
  );
}
