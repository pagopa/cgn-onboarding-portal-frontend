/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { remoteData } from "../../api/common";
import { Agreement } from "../../api/generated";

export const createAgreement = createAsyncThunk(
  "agreement/createStatus",
  async () => {
    try {
      return await remoteData.Index.Agreement.createAgreement.method(undefined);
    } catch (error) {
      return undefined;
    }
  }
);

interface ExtendedAgreement extends Agreement {
  reasonMessage?: string;
  startDate?: string;
}

interface AgreementState {
  value: ExtendedAgreement;
  loading: boolean;
}

const agreementSlice = createSlice({
  name: "agreement",
  initialState: { value: {}, loading: true } as AgreementState,
  reducers: {
    setImage: (state, action) => {
      state.value.imageUrl = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(createAgreement.pending, state => {
      state.loading = true;
    });
    builder.addCase(createAgreement.fulfilled, (state, action) => {
      if (action.payload) {
        state.value = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(createAgreement.rejected, state => {
      state.loading = false;
    });
  }
});

export const { setImage } = agreementSlice.actions;

export default agreementSlice.reducer;
