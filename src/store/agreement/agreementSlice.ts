/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { remoteData } from "../../api/common";
import { Agreement } from "../../api/generated";

interface ExtendedAgreement extends Agreement {
  reasonMessage?: string;
  startDate?: string;
}

interface AgreementState {
  value: ExtendedAgreement;
  loading: boolean;
}

const initialState: AgreementState = {
  value: {} as ExtendedAgreement,
  loading: true
};

export const createAgreement = createAsyncThunk(
  "agreement/create",
  async () => {
    try {
      return await remoteData.Index.Agreement.createAgreement.method(undefined);
    } catch {
      return undefined;
    }
  }
);

const agreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {
    setImage(state, action: PayloadAction<string>) {
      state.value.imageUrl = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createAgreement.pending, state => {
        state.loading = true;
      })
      .addCase(createAgreement.fulfilled, (state, action) => {
        if (action.payload) {
          state.value = action.payload;
        }
        state.loading = false;
      })
      .addCase(createAgreement.rejected, state => {
        state.loading = false;
      });
  }
});

export const { setImage } = agreementSlice.actions;
export default agreementSlice.reducer;
