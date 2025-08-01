import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./utils/zodFormikAdapter.ts"; // fixes CSP issues
import { envVariablesSchema } from "./utils/env-variables.ts";

envVariablesSchema.parse(import.meta.env);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
