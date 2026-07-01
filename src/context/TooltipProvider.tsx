import { ReactElement, useState, useRef, useCallback, useMemo } from "react";
import {
  ProviderProps,
  TooltipProviderState,
  initialState,
  TooltipContext
} from "./tooltip";

export function TooltipProvider({ children }: ProviderProps): ReactElement {
  const [isOpen, setOpen] = useState(false);
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
      {isOpen && (
        <div
          className="fixed-bottom me-6"
          style={{ left: "auto", width: "452px" }}
        >
          <div
            className={`alert bg-white alert-${severity} fade show py-4`}
            role="alert"
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                {title && (
                  <h4
                    className="alert-heading mb-4"
                    style={{ fontSize: "24px" }}
                  >
                    {title}
                  </h4>
                )}
                <p
                  className="m-0"
                  style={{ fontSize: "18px", fontWeight: 400 }}
                >
                  {text}
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={closeTooltip}
              />
            </div>
          </div>
        </div>
      )}
    </TooltipContext.Provider>
  );
}
