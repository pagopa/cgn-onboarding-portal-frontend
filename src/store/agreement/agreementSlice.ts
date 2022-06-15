/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toError } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { Agreement } from "../../api/generated";
import Api from "../../api/index";

export const createAgreement = createAsyncThunk("agreement/createStatus", () =>
  pipe(
    TE.tryCatch(() => Api.Agreement.createAgreement(), toError),
    TE.map(response => response.data),
    TE.mapLeft(_ => void 0)
  )()
);

interface ExtendedAgreement extends Agreement {
  reasonMessage?: string;
  startDate?: string;
  endDate?: string;
}

interface AgreementState {
  value: ExtendedAgreement;
  loading: boolean;
}

export const agreementSlice = createSlice({
  name: "agreement",
  initialState: { value: {}, loading: true } as AgreementState,
  reducers: {
    setImage: (state, action) => {
      state.value.imageUrl = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(createAgreement.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createAgreement.fulfilled, (state, action) => {
      if (action.payload) {
        state.value = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(createAgreement.rejected, (state, action) => {
      state.loading = false;
    });
  }
});

export const { setImage } = agreementSlice.actions;

export default agreementSlice.reducer;
