import { fromNullable } from "fp-ts/lib/Option";
import { fromOption } from "fp-ts/lib/Either";
import React, {
  useContext,
  createContext,
  useState,
  ReactElement,
  ReactChildren,
  useCallback,
  useRef,
  useMemo
} from "react";

export interface TooltipContextProps {
  triggerTooltip: (action: TooltipProviderState) => void;
}

export interface TooltipProviderState {
  severity: Severity | undefined;
  text: string;
  title?: string;
}

export enum Severity {
  DANGER = "danger",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success"
}

const initialState = {
  severity: undefined,
  text: "",
  title: ""
};

const TooltipContext = createContext<TooltipContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  triggerTooltip: () => {}
});

interface ProviderProps {
  children: ReactChildren | ReactElement;
}

function TooltipProvider({ children }: ProviderProps): ReactElement {
  const [open, openTooltip] = useState(false);
  const [{ severity, text, title }, setTooltip] = useState<
    TooltipProviderState
  >(initialState);

  const timeoutRef = useRef<NodeJS.Timeout>();

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
    timeoutRef.current = setTimeout(() => {
      openTooltip(false);
    }, 5000);
  }, []);

  const contextValue = useMemo(() => ({ triggerTooltip }), [triggerTooltip]);

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
      {open && (
        <div className="fixed-bottom mr-6" style={{ left: "auto" }}>
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

function useTooltip(): TooltipContextProps {
  return fromNullable(useContext(TooltipContext)).getOrElseL(() => {
    throw new Error("useTooltip must be used within a TooltipProvider");
  });
}

export { TooltipProvider, useTooltip };
