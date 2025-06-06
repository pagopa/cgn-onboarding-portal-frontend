import { useContext, createContext, ReactElement, ReactNode } from "react";

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

export const initialState = {
  severity: undefined,
  text: "",
  title: ""
};

export const TooltipContext = createContext<TooltipContextProps>({
  triggerTooltip: () => {}
});

export interface ProviderProps {
  children: ReactNode | ReactElement;
}

export function useTooltip(): TooltipContextProps {
  const value = useContext(TooltipContext);
  if (!value) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return value;
}
