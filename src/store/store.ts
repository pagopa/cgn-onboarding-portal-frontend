import { configureStore } from "@reduxjs/toolkit";
import agreementReducer from "./agreement/agreementSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      agreement: agreementReducer
    }
  });

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
