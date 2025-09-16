import "./utils/zod-csp-fix";
import { Outlet } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { it } from "date-fns/locale/it";
import { useMemo } from "react";
import { queryClient } from "./api/common";
import { AuthenticationProvider } from "./authentication/AuthenticationProvider";
import { TooltipProvider } from "./context/TooltipProvider";
import { makeStore } from "./store/store";

import { envVariablesSchema } from "./utils/env-variables.ts";
envVariablesSchema.parse(import.meta.env);

registerLocale("it", it);
setDefaultLocale("it");

export function App() {
  const store = useMemo(() => makeStore(), []);
  return (
    <Provider store={store}>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <AuthenticationProvider>
            <Outlet />
          </AuthenticationProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </Provider>
  );
}

// eslint-disable-next-line no-console
console.info(
  `%cVERSION %c${__APP_VERSION__}`,
  "font-weight: bold; color: lightblue;",
  "font-weight: normal;"
);

// eslint-disable-next-line no-console
console.info(
  `%cCOMMIT %c${__COMMIT_HASH__}`,
  "font-weight: bold; color: lightblue;",
  "font-weight: normal;"
);
