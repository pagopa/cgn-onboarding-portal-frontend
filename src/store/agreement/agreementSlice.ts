/* eslint-disable functional/immutable-data */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { fromNullable } from "fp-ts/lib/Option";
import { identity } from "fp-ts/lib/function";
import Api from '../../api/index';
import { Agreement, ApprovedAgreement } from '../../api/generated';
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


interface ExtendedAgreement extends Agreement {
    startDate?: string;
    endDate?: string;
}

interface AgreementState {
	value: ExtendedAgreement;
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

export default agreementSlice.reducer;
