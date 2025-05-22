import { ReactElement, useState, useRef, useCallback, useMemo } from "react";
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
    // eslint-disable-next-line functional/immutable-data
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
          <div
            className={`alert bg-white alert-dismissible alert-${severity} fade show`}
            role="alert"
          >
            {title && <h4 className="alert-heading">{title}</h4>}
            <p>{text}</p>
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              onClick={closeTooltip}
            >
              <span>&times;</span>
            </button>
          </div>
        </div>
      )}
    </TooltipContext.Provider>
  );
}
