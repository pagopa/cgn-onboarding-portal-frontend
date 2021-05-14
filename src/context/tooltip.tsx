import { fromNullable } from "fp-ts/lib/Option";
import { fromOption } from "fp-ts/lib/Either";
import React, {
  useContext,
  createContext,
  useState,
  ReactElement,
  ReactChildren
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

  // eslint-disable-next-line functional/no-let
  let timeout: any = null;

  const closeTooltip = (): void => {
    openTooltip(false);
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const triggerTooltip = (tooltip: TooltipProviderState): void => {
    openTooltip(true);
    setTooltip(tooltip);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      openTooltip(false);
    }, 5000);
  };

  return (
    <TooltipContext.Provider value={{ triggerTooltip }}>
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
