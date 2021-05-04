/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Agreement } from '../../api/generated';
import Api from '../../api/index';
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { fromNullable } from "fp-ts/lib/Option";
import { identity } from "fp-ts/lib/function";
import { setCookie } from '../../utils/cookie';

export const createAgreement = createAsyncThunk('agreement/createStatus', async () => 
await tryCatch(() => Api.Agreement.createAgreement(), toError)
	.map(response => 
		fromNullable(response.data)
		.foldL(() => response.data, _ => {
			setCookie(_.id);
			return _;
		})
	)
	.fold(
		() => void 0,
		identity
	).run()
);

interface AgreementState {
	value: Agreement;
	loading: boolean;
}

export const agreementSlice = createSlice({
	name: 'agreement',
	initialState: { value: {}, loading: false } as AgreementState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(createAgreement.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(createAgreement.fulfilled, (state, action) => {
			console.log(action)
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
