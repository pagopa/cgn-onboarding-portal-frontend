/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Agreement } from '../../api/generated';
import Api from '../../api/index';

export const createAgreement = createAsyncThunk('agreement/createStatus', async () => {
	const response = await Api.Agreement.createAgreement();
	return response.data;
});

interface AgreementStore {
	value: Agreement;
	loading: boolean;
}

export const agreementSlice = createSlice({
	name: 'agreement',
	initialState: { value: {}, loading: false } as AgreementStore,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(createAgreement.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(createAgreement.fulfilled, (state, action) => {
			state.value = action.payload;
			state.loading = false;
		});
		builder.addCase(createAgreement.rejected, (state, action) => {
			state.loading = false;
		});
	}
});

export const { set } = agreementSlice.actions;

export default agreementSlice.reducer;
