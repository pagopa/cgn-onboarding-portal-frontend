import { configureStore } from "@reduxjs/toolkit";
import agreementReducer from "./agreement/agreementSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    agreement: agreementReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
