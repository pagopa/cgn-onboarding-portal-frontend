/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Agreement } from '../../api/generated';
import Api from '../../api/index';
import { setCookie } from '../../utils/cookie';

export const createAgreement = createAsyncThunk('agreement/createStatus', async () => {
	const response = await Api.Agreement.createAgreement();
	if (response.data) {
		setCookie(response.data.id);
	}
	return response.data;
});

interface AgreementState {
	value: Agreement;
	loading: boolean;
}

export const agreementSlice = createSlice({
	name: 'agreement',
	initialState: { value: {}, loading: false },
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
